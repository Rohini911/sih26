"""
Hazard Detection Module
=======================
Identifies specific workplace safety hazard categories supported by report context.
Supports compound multi-hazard conditions (e.g. water leakage near electrical panel,
loose cable near walkway, emergency exit blocked, missing PPE).
Returns None if no specific hazard can be verified from the report text.
"""

import re
from typing import Optional

def detect_hazard(text: str) -> Optional[str]:
    """
    Identifies specific hazard categories supported by report context.
    Strictly avoids hallucinating hazards without evidence.
    """
    if not text or not isinstance(text, str):
        return None

    lower_text = text.lower()

    # 1. Compound: Water Leakage near Electrical Panel
    if ("water" in lower_text or "leak" in lower_text) and any(k in lower_text for k in ["electrical", "electric", "panel", "wire", "cable", "switch", "breaker"]):
        return "Water Leakage & Electrical Hazard"

    # 2. Compound: Loose Cable near Walkway (Electrical + Trip)
    if any(k in lower_text for k in ["cable", "wire", "cord"]) and any(k in lower_text for k in ["walkway", "aisle", "path", "floor", "ground", "trip", "loose"]):
        return "Electrical & Trip Hazard"

    # 3. Emergency Exit / Egress Obstruction
    if any(k in lower_text for k in ["emergency exit", "fire exit", "exit blocked", "blocked exit", "fire door", "blocked door", "egress"]):
        return "Emergency Access & Egress Obstruction"

    # 4. PPE / Head Protection Non-Compliance
    if re.search(r'\b(helmet|hard hat|hard_hat|without_helmet|no helmet)\b', lower_text):
        return "PPE / Head Protection Non-Compliance"
    if re.search(r'\b(harness|without_harness|no harness|safety belt|lanyard)\b', lower_text):
        return "Fall Protection / Safety Harness Non-Compliance"
    if re.search(r'\b(ppe|without_ppe|no ppe|goggles|safety glasses|respirator|face shield)\b', lower_text):
        return "Personal Protective Equipment (PPE) Non-Compliance"

    # 5. Housekeeping / Storage & Trip Hazard
    if any(k in lower_text for k in ["tools on floor", "tools were left", "tools left on", "clutter", "boxes stacked", "stacked improperly", "unstable stack"]):
        return "Housekeeping / Trip Hazard"

    # 6. Gas Leakage & Flammable Atmosphere
    if any(k in lower_text for k in ["gas is leaking", "gas leak", "gas leakage", "gas odor", "smell of gas", "h2s", "toxic gas", "flammable gas", "hissing"]):
        return "Gas Leakage & Flammable Atmosphere"

    # 7. Mechanical Safeguard / Barrier Deficiency
    if any(k in lower_text for k in ["machine guard", "guard is missing", "guard missing", "guard_missing", "guard was missing", "guard is loose", "guard loose"]):
        return "Mechanical Safeguard & Barrier Deficiency"

    # 8. Mobile Equipment / Forklift & Pedestrian Near Miss
    if any(k in lower_text for k in ["forklift", "truck", "dumper", "loader"]) and any(k in lower_text for k in ["pedestrian", "hit a pedestrian", "almost hit", "near collision", "narrowly missed"]):
        return "Mobile Equipment & Pedestrian Near Miss"

    # 9. Suspended Load & Dropped Object
    if re.search(r'\b(suspended load|overhead load|crane lift|rigging|dropped object|falling pipe|falling tool|fell from above|dropped from)\b', lower_text):
        return "Suspended Load & Dropped Object Hazard (Gravity / High Energy)"

    # 10. Work at Height & Fall Hazard
    if re.search(r'\b(height|scaffold|ladder|roof|edge|fall protection|harness|grating missing|hole|platform edge|climbing)\b', lower_text):
        return "Work at Height & Fall Hazard (Gravity)"

    # 11. General Electrical Hazard
    if re.search(r'\b(electrical|live wire|voltage|high voltage|panel|switchboard|switchgear|arc flash|energized|shock|breaker|conduit|cable cut)\b', lower_text):
        return "Electrical Arc Flash & Shock Hazard (Electrical Energy)"

    # 12. Confined Space
    if re.search(r'\b(confined space|tank entry|vessel entry|manhole|pit entry)\b', lower_text):
        return "Confined Space & Atmospheric Hazard"

    # 13. Stored Pressure / Pressurized Lines
    if re.search(r'\b(loto|lockout|tagout|pressurized|pressure|high[- ]pressure|hydraulic|steam|line break|hydrotest|blowout|stored pressure|pipeline pressure)\b', lower_text):
        return "Hazardous Energy & Pressurized Line Release"

    # 14. Fire & Thermal
    if re.search(r'\b(fire|hot work|welding|sparks|combustible|flammable liquid|hydrocarbon spill|flash)\b', lower_text):
        return "Fire & Thermal Ignition Hazard"

    # 15. Chemical Exposure
    if re.search(r'\b(chemical|acid|caustic|solvent|corrosive|toxic spill|chemical drum)\b', lower_text):
        return "Hazardous Chemical Exposure Hazard"

    # 16. Excavation & Trenching
    if re.search(r'\b(trench|excavation|cave-in|collapse|shoring|unstable slope)\b', lower_text):
        return "Excavation & Trench Collapse Hazard"

    # 17. Slip / Trip / Fall Hazard (Environmental / Walking Surface)
    if re.search(r'\b(slip\w*|slippery|slick|trip\w*|uneven surface|water on floor|water puddle|puddle|wet floor|oil spill|oil on floor)\b', lower_text):
        return "Slip / Trip / Fall Hazard"

    # 18. Lighting / Visibility
    if re.search(r'\b(lighting|poor lighting|dim light|dark walkway|glare)\b', lower_text):
        return "Lighting & Visibility Defect"

    return None
