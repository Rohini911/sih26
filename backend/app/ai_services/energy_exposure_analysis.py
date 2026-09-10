"""
Deterministic Energy Vector and Worker Exposure Analysis
---------------------------------------------------------
Classifies the primary physical energy vector involved in industrial operations:
- Gravity
- Kinetic
- Electrical
- Chemical
- Thermal
- Pneumatic / High Pressure

Strictly adheres to:
If no explicit physical energy vector is stated in the observation (e.g. 'At front door it is very slippery'),
returns 'Not identified / Insufficient Information' rather than inventing an energy vector.
"""

import re
from typing import Dict, Optional

def analyze_energy_and_exposure(text: str) -> Dict[str, Optional[str]]:
    """
    Deterministically evaluates energy vector and worker exposure pathways.
    Returns 'Not identified / Insufficient Information' if no recognizable physical energy vector is detected.
    """
    if not text or not isinstance(text, str):
        return {
            "energy_source": "Not identified / Insufficient Information",
            "exposure": "Insufficient Information"
        }

    lower_text = text.lower()
    energy_source = None
    exposure = None

    # 1. Electrical Energy
    if re.search(r'\b(electrical|voltage|11kv|415v|440v|33kv|230v|switchgear|transformer|live cable|circuit breaker|arc flash|electric shock|de-energiz|loto|lockout|live panel|loose cable|exposed wire)\b', lower_text):
        energy_source = "Electrical"
    
    # 2. Pneumatic / High Pressure Energy
    elif re.search(r'\b(pressurized|pressure|hydraulic|pneumatic|high-pressure|blowout|hydrotest|wellhead|choke manifold|bop|steam line|gas line|pipe burst|ruptured hose|psi|bar)\b', lower_text):
        energy_source = "Pneumatic / High Pressure"

    # 3. Chemical / Toxic / Gas Energy
    elif re.search(r'\b(chemical|acid|toxic|h2s|hydrogen sulfide|caustic|flammable vapor|corrosive|gas leak|gas is leaking|toxic gas|hydrocarbon|oxygen deficiency|nitrogen)\b', lower_text):
        energy_source = "Chemical / Gas"

    # 4. Thermal Energy
    elif re.search(r'\b(thermal|fire|flame|hot work|welding|cutting torch|furnace|boiler|hot surface|molten|flash fire|steam burn)\b', lower_text):
        energy_source = "Thermal"

    # 5. Gravity Energy (Explicit elevation or falling heavy mass)
    elif re.search(r'\b(suspended load|dropped object|crane lift|hoist|scaffold|work at height|fall from height|ladder|roof edge|derrick|falling pipe|falling tool)\b', lower_text):
        energy_source = "Gravity"

    # 6. Kinetic Energy (Explicit heavy moving vehicle or machinery)
    elif re.search(r'\b(forklift|truck|vehicle|reversing|moving equipment|rotating machinery|conveyor belt|crush|pinch point|nip point|flywheel|winch)\b', lower_text):
        energy_source = "Kinetic"

    # Default for simple environmental/housekeeping hazards (e.g. 'At front door it is very slippery')
    # Do NOT invent an energy vector if none is present!
    else:
        energy_source = "Not identified / Insufficient Information"

    # Worker Exposure pathways
    if re.search(r'\b(standing under|beneath suspended load|under load|drop zone)\b', lower_text):
        exposure = "Worker positioned in direct line-of-fire beneath suspended load"
    elif re.search(r'\b(work at height|on scaffold|on roof|ladder without tie-off|near open edge|at elevation)\b', lower_text):
        exposure = "Worker exposed to unprotected fall edge at elevation"
    elif re.search(r'\b(touching live|live panel|contact with conductor|bare hands|uninsulated)\b', lower_text):
        exposure = "Worker in direct physical proximity to live electrical conductors"
    elif re.search(r'\b(water leaking near|water is leaking near).*?(panel|electrical|switch)', lower_text):
        exposure = "Water ingress in immediate proximity to energized electrical equipment"
    elif re.search(r'\b(inside vessel|confined space|tank entry|inside pit|manhole)\b', lower_text):
        exposure = "Worker occupied within enclosed/confined space atmospheric hazard zone"
    elif re.search(r'\b(near forklift|vehicle path|almost hit a pedestrian|pedestrian in roadway|crossing blind spot)\b', lower_text):
        exposure = "Pedestrian situated in immediate trajectory of mobile industrial equipment"
    elif re.search(r'\b(near rotating shaft|reaching into nip|unguarded gear|entanglement)\b', lower_text):
        exposure = "Worker limbs exposed to unguarded rotating machinery pinch point"
    elif re.search(r'\b(not_exposed|not in line of fire|zero exposure)\b', lower_text):
        exposure = "Personnel confirmed not exposed to hazardous energy trajectory"
    elif re.search(r'\b(without helmet|without_helmet|no helmet|not wearing helmet)\b', lower_text):
        exposure = "Worker exposed to potential overhead head impact without protective helmet"
    elif re.search(r'\b(slip\w*|slippery|trip|walkway|entrance|door|floor)\b', lower_text):
        exposure = "Possible pedestrian worker exposure to surface slip/trip"
    else:
        exposure = "Possible"

    return {
        "energy_source": energy_source,
        "exposure": exposure
    }
