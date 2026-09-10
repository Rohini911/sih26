"""
Deterministic Energy Vector and Worker Exposure Analysis
---------------------------------------------------------
Classifies the primary physical energy vector into standardized categories:
- GRAVITY
- KINETIC
- ELECTRICAL
- THERMAL
- CHEMICAL
- HIGH_PRESSURE / PNEUMATIC / HYDRAULIC
- TOXIC / ATMOSPHERIC
- MULTIPLE
- UNKNOWN

Strictly adheres to:
If no explicit physical energy vector is stated in the observation,
returns 'UNKNOWN' rather than fabricating vectors.
Universal thresholds (e.g. >150 PSI, >50V) do not independently dictate SIF.
"""

import re
from typing import Dict, Optional, List

def analyze_energy_and_exposure(text: str) -> Dict[str, Optional[str]]:
    """
    Deterministically evaluates energy vector and worker exposure pathways.
    Returns 'UNKNOWN' if no recognizable physical energy vector is detected.
    """
    if not text or not isinstance(text, str):
        return {
            "energy_source": "UNKNOWN",
            "exposure": "Insufficient Information"
        }

    lower_text = text.lower()
    detected_sources: List[str] = []

    # 1. ELECTRICAL
    if re.search(r'\b(electrical|voltage|11kv|415v|440v|33kv|230v|switchgear|transformer|live cable|circuit breaker|arc flash|electric shock|de-energiz|loto|lockout|live panel|loose cable|exposed wire)\b', lower_text):
        detected_sources.append("ELECTRICAL")
    
    # 2. HIGH_PRESSURE / PNEUMATIC / HYDRAULIC
    if re.search(r'\b(pressurized|pressure|hydraulic|pneumatic|high-pressure|blowout|hydrotest|wellhead|choke manifold|bop|steam line|gas line|pipe burst|ruptured hose|psi|bar)\b', lower_text):
        detected_sources.append("HIGH_PRESSURE / PNEUMATIC / HYDRAULIC")

    # 3. TOXIC / ATMOSPHERIC
    if re.search(r'\b(toxic gas|h2s|hydrogen sulfide|oxygen deficiency|nitrogen|toxic atmosphere|confined space|vessel entry|entering the vessel|entered the vessel|inside the vessel|inside the tank|tank entry|gas test|atmospheric monitoring|air monitoring)\b', lower_text):
        detected_sources.append("TOXIC / ATMOSPHERIC")

    # 4. CHEMICAL (Corrosive / Hazardous liquid or chemical exposure)
    if re.search(r'\b(chemical|acid|caustic|corrosive|chemical spill|toxic spill|chemical drum|solvent)\b', lower_text) and "TOXIC / ATMOSPHERIC" not in detected_sources:
        detected_sources.append("CHEMICAL")

    # 5. THERMAL
    if re.search(r'\b(thermal|fire|flame|hot work|welding|cutting torch|furnace|boiler|hot surface|molten|flash fire|steam burn|heat|burn|heat exposure)\b', lower_text):
        detected_sources.append("THERMAL")

    # 6. GRAVITY (Explicit elevation or falling heavy mass)
    if re.search(r'\b(suspended load|dropped object|crane lift|hoist|scaffold|work at height|fall from height|ladder|roof edge|derrick|falling pipe|falling tool)\b', lower_text):
        detected_sources.append("GRAVITY")

    # 7. KINETIC (Explicit heavy moving vehicle or rotating machinery)
    if re.search(r'\b(forklift|truck|vehicle|reversing|moving equipment|rotating machinery|conveyor belt|crush|pinch point|nip point|flywheel|winch)\b', lower_text):
        detected_sources.append("KINETIC")

    # Category determination
    unique_sources = list(dict.fromkeys(detected_sources))
    if len(unique_sources) == 0:
        energy_source = "UNKNOWN"
    elif len(unique_sources) == 1:
        energy_source = unique_sources[0]
    else:
        energy_source = "MULTIPLE"

    # Worker Exposure pathways
    if re.search(r'\b(standing under|beneath suspended load|under load|drop zone)\b', lower_text):
        exposure = "Worker positioned in direct line-of-fire beneath suspended load"
    elif re.search(r'\b(work at height|on scaffold|on roof|ladder without tie-off|near open edge|at elevation)\b', lower_text):
        exposure = "Worker exposed to unprotected fall edge at elevation"
    elif re.search(r'\b(touching live|live panel|contact with conductor|bare hands|uninsulated)\b', lower_text):
        exposure = "Worker in direct physical proximity to live electrical conductors"
    elif re.search(r'\b(water leaking near|water is leaking near).*?(panel|electrical|switch)', lower_text):
        exposure = "Water ingress in immediate proximity to energized electrical equipment"
    elif re.search(r'\b(inside vessel|confined space|tank entry|inside pit|manhole|entering the vessel|entered the vessel|vessel entry)\b', lower_text):
        exposure = "Worker occupied within enclosed/confined space atmospheric hazard zone"
    elif re.search(r'\b(near forklift|vehicle path|almost hit a pedestrian|pedestrian in roadway|crossing blind spot)\b', lower_text):
        exposure = "Pedestrian situated in immediate trajectory of mobile industrial equipment"
    elif re.search(r'\b(near rotating shaft|reaching into nip|unguarded gear|entanglement)\b', lower_text):
        exposure = "Worker limbs exposed to unguarded rotating machinery pinch point"
    elif re.search(r'\b(not_exposed|not in line of fire|zero exposure)\b', lower_text):
        exposure = "Personnel confirmed not exposed to hazardous energy trajectory"
    elif re.search(r'\b(without helmet|without_helmet|no helmet|not wearing helmet)\b', lower_text):
        exposure = "Worker exposed to potential overhead head impact without protective helmet"
    elif re.search(r'\b(heat|burn|heat exposure)\b', lower_text):
        exposure = "Worker exposed to intense thermal energy / extreme heat source"
    elif re.search(r'\b(slip\w*|slippery|trip|walkway|entrance|door|floor)\b', lower_text):
        exposure = "Possible pedestrian worker exposure to surface slip/trip"
    elif re.search(r'\b(worker|man|person|employee|technician|operator|crew)\b', lower_text):
        exposure = "Worker present in active operational work area"
    else:
        exposure = "Possible"

    return {
        "energy_source": energy_source,
        "exposure": exposure
    }

