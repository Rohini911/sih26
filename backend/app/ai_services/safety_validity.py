"""
Safety Observation Validity Layer
=================================
Validates whether free-text input constitutes a legitimate workplace safety
observation (Unsafe Act, Unsafe Condition, Hazard, Near-Miss, Environmental Defect)
versus genuinely unrelated conversational or off-topic input.

Key Principle:
DO NOT require industrial equipment, energy vectors, or barrier failures before
accepting an observation. Simple operational, environmental, or housekeeping
observations (e.g. 'At front door it is very slippery', 'Emergency exit is blocked')
are fully valid safety observations.

Valid Categories Evaluated:
1. Slip / Trip / Fall (slippery, wet floor, puddle, trip, ice, oil slick, uneven)
2. PPE / Protective Clothing (helmet, goggles, harness, boots, earplugs, gloves)
3. Falling Object / Dropped Object (overhead tool, loose bracket, falling item)
4. Electrical Hazards (cables, wires, outlets, switchgear, sparks, live panels)
5. Fire & Thermal (sparks, hot surface, welding, open flame, flammable, smoke)
6. Chemical & Hazardous Substances (fumes, odors, acids, drums, spills, solvents)
7. Gas & Fluid Leakage (hissing, dripping, pipe leak, valve weeping, seepage)
8. Pressure & Pressurized Systems (hoses, gauges, cylinders, relief valves)
9. Mechanical & Machinery (guards, rotating shafts, nip points, belts, chains)
10. Vehicles & Mobile Equipment (forklifts, trucks, pedestrians, reversing)
11. Working at Height (scaffolding, ladders, roofs, railings, platforms)
12. Confined Space & Pits (tanks, vessels, manholes, toxic atmosphere)
13. Excavation & Trenching (ditches, shoring, cave-in risk, ground instability)
14. Lifting & Rigging (cranes, hoists, slings, shackles, suspended loads)
15. Energy Isolation / LOTO (lockout, tagout, isolation, de-energization)
16. Emergency Access & Egress (blocked exits, fire doors, obstructed extinguishers)
17. Housekeeping & Storage (clutter, tools on floor, improperly stacked boxes)
18. Lighting & Visibility (poor illumination, dark stairwells, blind spots, glare)
19. Environmental & Ambient Conditions (air quality, dust, extreme heat, cold)
20. Barrier & Control Deficiencies (loose guardrail, broken gate, missing signage)
21. Unsafe Acts (procedural bypass, speeding, horseplay, not following rules)
22. Unsafe Conditions (any physical state creating hazard potential)
23. Near Misses (almost hit, close call, narrowly avoided accident)
24. Worker Exposure (personnel proximity to physical hazard)
"""

import re
from typing import Dict, Any, Optional, List, Tuple

try:
    from rapidfuzz import fuzz, process
    RAPIDFUZZ_AVAILABLE = True
except ImportError:
    RAPIDFUZZ_AVAILABLE = False


# Canonical safety concepts for fuzzy spelling tolerance
CANONICAL_SAFETY_CONCEPTS = [
    "slippery", "slipped", "tripped", "hazard", "leakage", "leaking", "helmet",
    "harness", "goggles", "gloves", "barrier", "guardrail", "electrical",
    "wire", "cable", "switch", "breaker", "pressure", "chemical", "spill",
    "corrosion", "unlocked", "isolation", "blocked", "egress", "extinguisher",
    "scaffold", "ladder", "forklift", "pedestrian", "welding", "flammable",
    "exhaust", "ventilation", "lighting", "housekeeping", "clutter", "damage",
    "broken", "cracked", "missing", "unsecured", "overloaded", "malfunction"
]

# Genuinely unrelated conversational phrases
CONVERSATIONAL_PATTERNS = [
    r'^(?:hello|hi|hey|yo|howdy)(?:\s+there)?(?:\s+how\s+are\s+you)?[\.!\?]?$',
    r'\bhow\s+are\s+you\b',
    r'\bwho\s+are\s+you\b',
    r'\bwhat\s+is\s+your\s+name\b',
    r'\btell\s+me\s+a\s+joke\b',
    r'\bwhat\s+(?:is\s+the\s+)?weather\b',
    r'\bi\s+like\s+(?:cricket|football|movies|music|coding|pizza|coffee)\b',
    r'\bwhat\s+is\s+python\b',
    r'\bwhat\s+is\s+ai\b',
    r'\bgood\s+(?:morning|afternoon|evening|night)\b',
    r'^(?:thank\s+you|thanks|ok|okay|bye|goodbye)[\.!\?]?$',
    r'\bwho\s+won\s+the\s+match\b',
    r'\bsing\s+a\s+song\b',
]
CONVERSATIONAL_REGEX = re.compile("|".join(CONVERSATIONAL_PATTERNS), re.IGNORECASE)

# Comprehensive Safety Observation Category Signals
SAFETY_OBSERVATION_PATTERNS = [
    # 1. Slip / Trip / Fall
    (r'\b(slip\w*|slippery|slick|trip\w*|fall\w*|fell|stumble|water on floor|wet floor|water puddle|greasy floor|oil on floor|mud on deck|uneven surface|uneven floor|ice on walkway|skid)\b', "Slip / Trip / Fall"),
    
    # 2. PPE & Protective Equipment
    (r'\b(helmet|hard hat|safety shoes|steel toe|goggles|safety glasses|face shield|earplugs|harness|lanyard|high-vis|vest|respirator|mask|without ppe|no ppe|not wearing|no helmet|no harness)\b', "PPE / Protective Equipment"),
    
    # 3. Housekeeping & Storage
    (r'\b(housekeeping|tools on floor|left on the floor|clutter|boxes stacked|stacked improperly|unstable stack|messy|trash on walkway|debris on floor|unsecured pallet|blocked walkway|untidy)\b', "Housekeeping / Storage"),
    
    # 4. Emergency Access & Egress
    (r'\b(emergency exit|fire exit|exit blocked|blocked exit|fire door|fire extinguisher|eye wash|egress|obstruction in aisle|evacuation route|access blocked|path blocked)\b', "Emergency Access / Egress"),
    
    # 5. Lighting & Visibility
    (r'\b(lighting|poor lighting|dim light|dark walkway|dark corridor|bulb burnt|no light|insufficient lighting|glare|blind spot|visibility poor)\b', "Lighting / Visibility"),
    
    # 6. Electrical
    (r'\b(electrical|electric|wire|cable|cord|loose cable|frayed|bare wire|exposed conductor|conduit|outlet|plug|socket|switchboard|switchgear|panel|breaker|arc flash|spark|energized|shock)\b', "Electrical"),
    
    # 7. Leakage & Fluid Release
    (r'\b(leak\w*|water leaking|oil leaking|pipe leaking|hose leaking|dripping|seepage|puddle forming|steam leaking|flange leak|valve dripping|weeping)\b', "Leakage / Fluid Release"),
    
    # 8. Gas & Atmosphere
    (r'\b(gas leak|gas odor|smell of gas|h2s|toxic gas|fumes|vapor|smoke|hissing sound|air quality|ventilation|oxygen)\b', "Gas / Atmospheric Hazard"),
    
    # 9. Fire & Thermal
    (r'\b(fire|flame|sparks|hot surface|burning|combustible|flammable|welding without screen|smoking in area|heat stress|burn hazard)\b', "Fire & Thermal"),
    
    # 10. Mechanical & Machinery Safeguards
    (r'\b(guard\w*|machine guard|guard missing|guard loose|loose guard|exposed blade|nip point|pinch point|conveyor|rotating|moving parts|entanglement|jammed machine)\b', "Mechanical & Safeguards"),
    
    # 11. Vehicles & Mobile Equipment
    (r'\b(forklift|truck|vehicle|dumper|loader|pedestrian|almost hit|narrowly missed|near collision|speeding vehicle|reversing without alarm|reversing without spotter)\b', "Vehicle & Pedestrian Safety"),
    
    # 12. Working at Height
    (r'\b(height|scaffold\w*|ladder|roof|edge|mezzanine|platform|handrail missing|open grating|hole in floor|toe-board missing|fall hazard)\b', "Working at Height"),
    
    # 13. Confined Space & Pits
    (r'\b(confined space|vessel entry|tank entry|pit entry|manhole|trench|excavation|ditch)\b', "Confined Space & Excavation"),
    
    # 14. Lifting & Rigging
    (r'\b(crane|hoist|winch|sling|rigging|shackle|suspended load|overhead load|dropped object|falling tool|lifting gear)\b', "Lifting & Rigging"),
    
    # 15. Energy Isolation (LOTO) & Permits
    (r'\b(loto|lockout|tagout|isolation|isolated|permit|ptw|work permit|authorization|de-energize)\b', "Energy Isolation & Work Authorization"),
    
    # 16. Barrier & Physical Protection Deficiencies
    (r'\b(barricade|handrail|guardrail|barrier missing|barrier damaged|fence broken|gate open|warning sign missing|warning tape)\b', "Barrier & Physical Protection"),
    
    # 17. Unsafe Acts & Human Behaviors
    (r'\b(unsafe act|bypassed|ignored rule|horseplay|running on stairs|standing under|overreaching|climbing without|unauthorized)\b', "Unsafe Act / Behavior"),
    
    # 18. General Hazard & Unsafe Condition terms
    (r'\b(hazard|unsafe|danger\w*|risk|near miss|incident|accident|damage\w*|defect\w*|faulty|abnormal|unstable|loose\b|corroded|vibrating)\b', "Operational Hazard")
]


def classify_safety_observation_validity(text: str) -> Dict[str, Any]:
    """
    Evaluates whether raw input is a legitimate workplace safety observation
    or an unrelated conversational query.

    Returns:
        Dict containing:
            - is_valid_safety_observation: bool
            - is_unrelated: bool
            - primary_category: Optional[str]
            - detected_categories: List[str]
            - confidence_score: float (0.0 to 1.0)
            - explanation: str
    """
    if not text or not isinstance(text, str):
        return {
            "is_valid_safety_observation": False,
            "is_unrelated": True,
            "primary_category": None,
            "detected_categories": [],
            "confidence_score": 0.0,
            "explanation": "No text provided. Please enter a workplace safety observation."
        }

    cleaned = text.strip()

    # Very short inputs (e.g. "hi", "ok", "a")
    if len(cleaned) < 4:
        return {
            "is_valid_safety_observation": False,
            "is_unrelated": True,
            "primary_category": None,
            "detected_categories": [],
            "confidence_score": 0.0,
            "explanation": "The description does not appear to contain a workplace safety observation. Please describe a safety hazard, unsafe condition, unsafe act, or near-miss observation."
        }

    lower_cleaned = cleaned.lower()

    # Step 1: Detect and match safety observation categories
    matched_categories: List[str] = []
    for pattern, category_name in SAFETY_OBSERVATION_PATTERNS:
        if re.search(pattern, lower_cleaned):
            if category_name not in matched_categories:
                matched_categories.append(category_name)

    # Step 2: If regex didn't find a direct hit, apply fuzzy concept matching
    if not matched_categories and RAPIDFUZZ_AVAILABLE:
        tokens = re.findall(r'\b[a-z]{4,}\b', lower_cleaned)
        for token in tokens:
            best_match = process.extractOne(token, CANONICAL_SAFETY_CONCEPTS, scorer=fuzz.ratio, score_cutoff=85)
            if best_match:
                # Map fuzzy hit to a general category
                concept = best_match[0]
                if concept in ["slippery", "slipped", "tripped"]:
                    matched_categories.append("Slip / Trip / Fall")
                elif concept in ["helmet", "harness", "goggles", "gloves"]:
                    matched_categories.append("PPE / Protective Equipment")
                elif concept in ["wire", "cable", "electrical", "switch", "breaker"]:
                    matched_categories.append("Electrical")
                elif concept in ["leakage", "leaking"]:
                    matched_categories.append("Leakage / Fluid Release")
                elif concept in ["housekeeping", "clutter"]:
                    matched_categories.append("Housekeeping / Storage")
                elif concept in ["blocked", "egress", "extinguisher"]:
                    matched_categories.append("Emergency Access / Egress")
                else:
                    matched_categories.append("Operational Hazard")
                break

    # Step 3: Check for pure conversational/off-topic patterns
    is_pure_conversational = bool(CONVERSATIONAL_REGEX.search(lower_cleaned))

    # Decision Logic:
    # If safety patterns matched, it is a VALID SAFETY OBSERVATION even if conversational words coexist
    # (e.g. "Hello, water is leaking near door" -> VALID because of "water is leaking near door")
    if matched_categories:
        primary = matched_categories[0]
        return {
            "is_valid_safety_observation": True,
            "is_unrelated": False,
            "primary_category": primary,
            "detected_categories": matched_categories,
            "confidence_score": min(0.98, 0.70 + (0.10 * len(matched_categories))),
            "explanation": f"Validated workplace safety observation relating to {primary}."
        }

    # If conversational pattern matches and NO safety category is present:
    if is_pure_conversational:
        return {
            "is_valid_safety_observation": False,
            "is_unrelated": True,
            "primary_category": None,
            "detected_categories": [],
            "confidence_score": 0.0,
            "explanation": "The description does not appear to contain a workplace safety observation. Please describe a safety hazard, unsafe condition, unsafe act, or near-miss observation."
        }

    # Fallback check: Does text contain action verbs or physical condition adjectives?
    # e.g. "Boxes were tilted", "Pipe was hot", "Smell was strange"
    condition_verbs = re.search(r'\b(was|is|were|are|found|observed|noticed|left|fell|hanging|leaking|loose|blocked|broken|damaged|hot|cold|smells?|wet|dark|sharp)\b', lower_cleaned)
    noun_indicators = re.search(r'\b(floor|door|walkway|wall|pipe|machine|stair|tool|box|panel|wire|room|yard|deck|ground|air|water|tank)\b', lower_cleaned)
    if condition_verbs and noun_indicators:
        return {
            "is_valid_safety_observation": True,
            "is_unrelated": False,
            "primary_category": "Unsafe Condition",
            "detected_categories": ["Unsafe Condition"],
            "confidence_score": 0.75,
            "explanation": "Validated general operational unsafe condition."
        }

    # Genuinely unclassifiable / unrelated non-safety input
    return {
        "is_valid_safety_observation": False,
        "is_unrelated": True,
        "primary_category": None,
        "detected_categories": [],
        "confidence_score": 0.0,
        "explanation": "The description does not appear to contain a workplace safety observation. Please describe a safety hazard, unsafe condition, unsafe act, or near-miss observation."
    }
