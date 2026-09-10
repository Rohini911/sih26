"""
Historical Pattern Analysis & Dynamic Weak-Signal Detection Service
-------------------------------------------------------------------
Implements multi-dimensional evidence correlation between the CURRENT REPORT
and all previously stored relevant safety records in the database.

Core Governance Rules:
1. Triggered dynamically on every single report analysis and bulk CSV ingestion.
2. Compares current report against actual stored historical reports for the organization.
3. Does NOT claim a weak signal on single/isolated observations (Strict Rule: >= 2 records required).
4. Uses 'Narrative Similarity — Jaccard Token Similarity' for transparent lexical comparison.
5. Multi-evidence correlation: Narrative similarity + Spatial/Unit co-location + Hazard taxonomy + Barrier issue + Energy vector.
6. Prevents duplicate weak signals: Updates existing WeakSignal entities when recurring patterns intensify.
7. Formulates conservative 'Potential escalation paths' without claiming certainty (never 'fire will occur').
8. Strictly maintains bi-directional relationships: SafetyReport <-> WeakSignal.
"""

import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
from sqlalchemy.orm import Session

from ..models.safety_report import SafetyReport
from ..models.ai_analysis import AIAnalysis
from ..models.weak_signal import WeakSignal
from ..ai_services.similarity_service import compute_similarity


def normalize_unit(val: Optional[str]) -> str:
    """Normalizes unit and location strings for robust spatial matching."""
    if not val:
        return "unknown"
    s = str(val).strip().lower()
    m = re.search(r'unit\s*[-_#]?\s*0*(\d+)', s)
    if m:
        return f"unit-{int(m.group(1))}"
    if "front door" in s or "entrance" in s or "entry" in s:
        return "entrance-area"
    if "compressor" in s:
        return "compressor-bay"
    if "substation" in s or "switchgear" in s or "electrical room" in s:
        return "electrical-substation"
    if "walkway" in s or "corridor" in s or "aisle" in s:
        return "transit-walkway"
    return re.sub(r'[^a-z0-9]', '', s) or "general-area"


def extract_hazard_family(hazard_name: Optional[str], text: str) -> str:
    """Classifies the primary hazard into its industrial safety family."""
    combined = f"{hazard_name or ''} {text or ''}".lower()
    
    if any(k in combined for k in ["slip", "slippery", "slick", "trip", "wet floor", "water on floor", "water puddle", "surface housekeeping"]):
        return "SLIP_TRIP_FALL"
    if any(k in combined for k in ["water is leaking near", "water leaking near electrical", "water leakage & electrical", "panel water"]):
        return "WATER_ELECTRICAL_COMPOUND"
    if any(k in combined for k in ["gas", "leak", "hiss", "flange", "propane", "lpg", "methane", "h2s"]):
        return "GAS_LEAKAGE"
    if any(k in combined for k in ["electrical", "electric", "cable", "switchgear", "panel", "voltage", "arcing", "breaker", "shock"]):
        return "ELECTRICAL_HAZARD"
    if any(k in combined for k in ["guard", "machine guard", "nip point", "conveyor", "rotating parts", "pinch point"]):
        return "MACHINE_GUARDING"
    if any(k in combined for k in ["forklift", "truck", "pedestrian", "vehicle", "near miss with pedestrian"]):
        return "VEHICLE_PEDESTRIAN"
    if any(k in combined for k in ["exit", "emergency exit", "fire exit", "egress", "door blocked"]):
        return "EMERGENCY_EGRESS"
    if any(k in combined for k in ["helmet", "hard hat", "ppe", "safety glasses", "goggles", "respirator", "head protection"]):
        return "PPE_NON_COMPLIANCE"
    if any(k in combined for k in ["tools", "housekeeping", "boxes stacked", "stacked improperly", "clutter"]):
        return "HOUSEKEEPING_STORAGE"
    if any(k in combined for k in ["height", "scaffold", "ladder", "roof edge", "fall from height"]):
        return "WORKING_AT_HEIGHT"
    if any(k in combined for k in ["confined space", "tank entry", "vessel entry"]):
        return "CONFINED_SPACE"
    if any(k in combined for k in ["fire", "hot work", "welding", "open flame", "sparks"]):
        return "HOT_WORK_FIRE"
    if any(k in combined for k in ["pressure", "pressurized", "psi", "hydraulic", "hydrotest", "blowout"]):
        return "PRESSURE_HAZARD"
    
    return "OPERATIONAL_DEVIATION"


def generate_potential_escalation_path(hazard_family: str, hazard_name: str, location: str) -> str:
    """
    Formulates conservative potential escalation pathways without claiming certainty.
    Strictly uses: 'Potential escalation path', NOT 'Fire will occur'.
    """
    paths = {
        "GAS_LEAKAGE": "Repeated gas release → vapor accumulation in congested area → possible ignition source exposure → potential flash fire or vapor cloud overpressure event.",
        "SLIP_TRIP_FALL": "Repeated liquid/water accumulation on walking surface → loss of foot traction → possible fall from same level → potential musculoskeletal sprain or contusion injury.",
        "WATER_ELECTRICAL_COMPOUND": "Water ingress adjacent to energized busbars → moisture degradation of conductor insulation → possible phase-to-ground flashover → potential electrical arc blast, equipment damage, or electrical shock.",
        "ELECTRICAL_HAZARD": "Repeated electrical terminal looseness or exposed cabling → conductor thermal stress or physical wear → possible insulation breakdown → potential arc flash fault, fire, or worker electrocution.",
        "MACHINE_GUARDING": "Repeated operation without physical safeguard in place → personnel exposure to rotating machinery → possible mechanical nip-point entrapment → potential crushing or serious hand injury.",
        "VEHICLE_PEDESTRIAN": "Repeated close-proximity mobile vehicle movement near workers → blind-spot line-of-sight obstruction → possible vehicle trajectory deviation → potential pedestrian struck-by collision.",
        "EMERGENCY_EGRESS": "Repeated obstruction of designated egress door → impeded egress flow during abnormal event → possible evacuation delay → potential personnel exposure to smoke or hazardous conditions.",
        "PPE_NON_COMPLIANCE": "Repeated work without mandatory head protection → overhead activity in operating sector → possible dropped object deflection → potential serious traumatic impact injury.",
        "HOUSEKEEPING_STORAGE": "Repeated unattended tooling and unorganized storage on deck → pathway obstruction → possible tripping event → potential worker fall against structural steelwork.",
        "WORKING_AT_HEIGHT": "Repeated elevated work without positive fall arrest anchorage → plank displacement or loss of balance → possible fall from elevation → potential severe fall trauma.",
        "HOT_WORK_FIRE": "Repeated open spark discharge near combustible materials → thermal ember migration → possible smoldering ignition of residues → potential localized flash fire.",
        "PRESSURE_HAZARD": "Repeated pressure anomalies on fittings → cyclic mechanical fatigue on coupling → possible seal blowout → potential high-pressure fluid jet injection or equipment damage."
    }
    return paths.get(
        hazard_family,
        f"Recurring operational deviation regarding {hazard_name or 'hazard'} in {location} → repeated exposure to baseline condition → possible degradation of secondary barriers → potential escalation if unrectified."
    )


def build_weak_signal_title(hazard_family: str, hazard_name: str, unit: str) -> str:
    """Builds a professional, standardized industrial weak signal title."""
    titles = {
        "GAS_LEAKAGE": f"Recurring Flammable Gas Micro-Leakage & Containment Degradation ({unit})",
        "SLIP_TRIP_FALL": f"Recurring Surface Slip/Trip Hazard & Walking Floor Slickness ({unit})",
        "WATER_ELECTRICAL_COMPOUND": f"Recurring Water Leakage Adjacent to Energized Electrical Gear ({unit})",
        "ELECTRICAL_HAZARD": f"Recurring Electrical Distribution & Conductor Integrity Issues ({unit})",
        "MACHINE_GUARDING": f"Recurring Mechanical Safeguard & Interlock Barrier Deficiency ({unit})",
        "VEHICLE_PEDESTRIAN": f"Recurring Mobile Equipment & Pedestrian Proximity Near Misses ({unit})",
        "EMERGENCY_EGRESS": f"Recurring Emergency Egress Pathway & Fire Door Obstruction ({unit})",
        "PPE_NON_COMPLIANCE": f"Recurring Personal Protective Equipment (PPE) Non-Compliance Patterns ({unit})",
        "HOUSEKEEPING_STORAGE": f"Recurring Housekeeping & Unsecured Tooling Trip Hazards ({unit})",
        "WORKING_AT_HEIGHT": f"Recurring Elevated Work & Fall Protection Anchorage Gaps ({unit})",
        "HOT_WORK_FIRE": f"Recurring Hot Work Sparks & Combustible Proximity Observations ({unit})",
        "PRESSURE_HAZARD": f"Recurring Pressurized Line & Hydraulic Connection Vibrations ({unit})"
    }
    return titles.get(hazard_family, f"Recurring Safety Pattern: {hazard_name or 'Operational Finding'} ({unit})")


def detect_and_update_weak_signals(
    db: Session,
    org_id: str,
    current_report: SafetyReport,
    raw_nlp_result: Dict[str, Any],
    min_jaccard_threshold: float = 0.14
) -> Dict[str, Any]:
    """
    Executes historical comparison and weak signal detection strictly using
    actual historical database records for the organization.
    """
    current_text = f"{current_report.description} {current_report.additional_context or ''}".strip()
    current_unit = current_report.location or "Unit 1"
    norm_current_unit = normalize_unit(current_unit)
    
    current_hazard = (
        raw_nlp_result.get("identified_hazard") or 
        (current_report.ai_analysis.identified_hazard if current_report.ai_analysis else None) or 
        "Operational Observation"
    )
    current_family = extract_hazard_family(current_hazard, current_text)
    current_energy = raw_nlp_result.get("energy_source") or "Not identified / Insufficient Information"
    current_barrier = raw_nlp_result.get("barrier_information") or "BARRIER_INSUFFICIENT_INFO"

    # 1. Retrieve all prior safety reports for this organization (excluding current report)
    prior_reports = db.query(SafetyReport).filter(
        SafetyReport.organization_id == org_id,
        SafetyReport.id != current_report.id
    ).order_by(SafetyReport.id.desc()).all()

    if not prior_reports:
        return {
            "weak_signal_detected": False,
            "weak_signal_id": None,
            "weak_signal_title": None,
            "weak_signal_reason": "Single observation analyzed. No prior historical records exist for pattern correlation.",
            "escalation_path": None,
            "related_reports": [],
            "weak_signals": []
        }

    # 2. Compare current report with all historical reports
    matching_reports_info: List[Dict[str, Any]] = []
    matching_report_models: List[SafetyReport] = []

    for prev in prior_reports:
        prev_text = f"{prev.description} {prev.additional_context or ''}".strip()
        norm_prev_unit = normalize_unit(prev.location)
        prev_hazard = prev.ai_analysis.identified_hazard if prev.ai_analysis else ""
        prev_family = extract_hazard_family(prev_hazard, prev_text)
        
        # Narrative Similarity — Jaccard Token Similarity
        jaccard_sim = compute_similarity(current_text, prev_text)

        is_match = False
        match_reasons = []

        # Criterion A: Same unit/location AND (same hazard family OR moderate jaccard)
        if norm_current_unit == norm_prev_unit:
            if current_family == prev_family and current_family != "OPERATIONAL_DEVIATION":
                is_match = True
                match_reasons.append(f"Same operating area ({current_unit}) with recurring {current_family.replace('_', ' ').title()} condition")
            elif jaccard_sim >= min_jaccard_threshold:
                is_match = True
                match_reasons.append(f"Same operating area ({current_unit}) with high lexical similarity ({jaccard_sim:.2f})")

        # Criterion B: Same specific hazard across facility with significant narrative overlap
        elif current_family == prev_family and current_family != "OPERATIONAL_DEVIATION" and jaccard_sim >= 0.16:
            is_match = True
            match_reasons.append(f"Co-occurring {current_family.replace('_', ' ').title()} hazard pattern across operational areas (Jaccard: {jaccard_sim:.2f})")

        # Criterion C: High narrative similarity regardless of unit label (e.g. >= 0.30)
        elif jaccard_sim >= 0.30:
            is_match = True
            match_reasons.append(f"Very high narrative token overlap ({jaccard_sim:.2f}) with historical finding")

        if is_match:
            matching_report_models.append(prev)
            matching_reports_info.append({
                "report_id": prev.id,
                "report_reference": prev.report_reference,
                "report_type": prev.report_type,
                "location": prev.location,
                "report_date": prev.report_date,
                "short_description": prev.description[:100],
                "similarity_score": jaccard_sim,
                "similarity_method": "Narrative Similarity — Jaccard Token Similarity",
                "match_reason": "; ".join(match_reasons)
            })

    # 3. Weak Signal Decision Rule: Requires at least 1 matching historical report (Total count >= 2 records!)
    if not matching_report_models:
        return {
            "weak_signal_detected": False,
            "weak_signal_id": None,
            "weak_signal_title": None,
            "weak_signal_reason": "No recurring pattern detected across historical safety registers for this observation.",
            "escalation_path": None,
            "related_reports": [],
            "weak_signals": []
        }

    # Recurring pattern detected!
    recurrence_count = 1 + len(matching_report_models)
    escalation_path = generate_potential_escalation_path(current_family, current_hazard, current_unit)
    signal_title = build_weak_signal_title(current_family, current_hazard, current_unit)
    detection_reason = (
        f"{recurrence_count} correlated observations detected in {current_unit} "
        f"({current_report.report_reference} + {len(matching_report_models)} historical reports: "
        f"{', '.join([r.report_reference for r in matching_report_models[:3]])})."
    )

    # 4. Duplicate Weak Signal Prevention: Look for existing matching WeakSignal in DB
    existing_signal = db.query(WeakSignal).filter(
        WeakSignal.organization_id == org_id,
        WeakSignal.detected_hazard == current_family,
        WeakSignal.unit == norm_current_unit
    ).first()

    all_related_refs = [r.report_reference for r in matching_report_models] + [current_report.report_reference]
    all_related_ids = [r.id for r in matching_report_models] + [current_report.id]

    base_risk_score = 82 if recurrence_count == 2 else min(96, 82 + (recurrence_count - 2) * 5)
    risk_level = "High" if base_risk_score >= 90 else "Medium"

    if existing_signal:
        # UPDATE existing weak signal
        existing_signal.recurrence_count = max(existing_signal.recurrence_count + 1, recurrence_count)
        existing_signal.last_detected_at = datetime.utcnow()
        existing_signal.current_report_id = current_report.id
        existing_signal.detection_reason = (
            f"Pattern intensified: {existing_signal.recurrence_count} related observations documented "
            f"in {current_unit} ({current_report.report_reference} + {len(matching_report_models)} historical reports)."
        )
        existing_signal.escalation_path = escalation_path
        existing_signal.risk_score = base_risk_score
        existing_signal.risk_level = risk_level
        
        # Merge related IDs
        curr_ids = list(existing_signal.related_report_ids or [])
        for r_id in all_related_ids:
            if r_id not in curr_ids:
                curr_ids.append(r_id)
        existing_signal.related_report_ids = curr_ids

        # Ensure relationships in association table
        if current_report not in existing_signal.safety_reports:
            existing_signal.safety_reports.append(current_report)
        for rep in matching_report_models:
            if rep not in existing_signal.safety_reports:
                existing_signal.safety_reports.append(rep)

        db.commit()
        db.refresh(existing_signal)
        active_signal = existing_signal

    else:
        # CREATE new weak signal
        signal_count = db.query(WeakSignal).filter(WeakSignal.organization_id == org_id).count()
        new_signal_id = f"WS-{signal_count + 1:03d}"

        active_signal = WeakSignal(
            signal_id=new_signal_id,
            organization_id=org_id,
            signal_type="RECURRING_HAZARD",
            title=signal_title,
            category=current_family.replace("_", " ").title(),
            description=f"Automated multi-record surveillance detected recurring {current_family.replace('_', ' ').lower()} conditions in {current_unit}.",
            detected_hazard=current_family,
            location=current_unit,
            unit=norm_current_unit,
            activity=raw_nlp_result.get("identified_action") or "Routine Operations",
            energy_vector=current_energy,
            barrier_issue=current_barrier,
            recurrence_count=recurrence_count,
            risk_score=base_risk_score,
            risk_level=risk_level,
            first_detected_at=datetime.utcnow(),
            last_detected_at=datetime.utcnow(),
            current_report_id=current_report.id,
            related_report_ids=all_related_ids,
            detection_reason=detection_reason,
            escalation_path=escalation_path,
            recommended_action=f"Inspect and remediate recurring {current_hazard.lower()} conditions across {current_unit}; verify physical controls.",
            status="Under Review"
        )
        db.add(active_signal)
        db.flush()

        # Link relationships in association table
        active_signal.safety_reports.append(current_report)
        for rep in matching_report_models:
            active_signal.safety_reports.append(rep)

        db.commit()
        db.refresh(active_signal)

    # 5. Format structured Weak Signal output for instant API and UI display
    formatted_source_reports = [
        {
            "report_id": current_report.report_reference,
            "report_type": current_report.report_type,
            "date_submitted": current_report.report_date,
            "short_description": current_report.description,
            "unit": current_report.location,
            "excerpt": current_report.description
        }
    ]
    for rep in matching_report_models:
        formatted_source_reports.append({
            "report_id": rep.report_reference,
            "report_type": rep.report_type,
            "date_submitted": rep.report_date,
            "short_description": rep.description,
            "unit": rep.location,
            "excerpt": rep.description
        })

    structured_signal = {
        "id": active_signal.id,
        "signal_id": active_signal.signal_id,
        "title": active_signal.title,
        "category": active_signal.category,
        "cluster_detected": True,
        "relationship": f"Recurring {active_signal.category} ({current_unit})",
        "potential_consequence": active_signal.escalation_path,
        "combined_risk": active_signal.risk_level.upper(),
        "correlation_score": active_signal.risk_score,
        "risk_score": active_signal.risk_score,
        "risk_level": active_signal.risk_level,
        "reason": active_signal.detection_reason,
        "recommended_action": active_signal.recommended_action,
        "first_detected_date": active_signal.first_detected_at.strftime("%Y-%m-%d"),
        "source": "Automated Multi-Record Surveillance",
        "potential_sif_precursor": active_signal.escalation_path,
        "why_identified": active_signal.detection_reason,
        "energy_source": active_signal.energy_vector,
        "barrier_status": active_signal.barrier_issue,
        "review_status": active_signal.status,
        "reviewer_notes": active_signal.reviewer_notes or "Under review by Operational Safety Team.",
        "recurrence_count": active_signal.recurrence_count,
        "source_reports": formatted_source_reports,
        "signals": [
            {
                "signal_num": idx + 1,
                "report_id": r["report_id"],
                "description": r["short_description"],
                "individual_risk": "MEDIUM",
                "location": r["unit"],
                "date": r["date_submitted"]
            }
            for idx, r in enumerate(formatted_source_reports)
        ],
        "progression_steps": [
            {"step": "First Anomaly", "trend": "Increasing", "status": f"Initial observation logged in {current_unit}"},
            {"step": "Recurrent Detection", "trend": "Increasing", "status": f"{recurrence_count} recurring reports identified without permanent elimination"},
            {"step": "Precursor Escalation", "trend": "Stable", "status": active_signal.escalation_path}
        ]
    }

    current_report_summary = {
        "report_id": current_report.id,
        "report_reference": current_report.report_reference,
        "report_type": current_report.report_type,
        "location": current_report.location,
        "report_date": current_report.report_date,
        "short_description": current_report.description[:100],
        "similarity_score": 1.0,
        "similarity_method": "Active Incident Trigger",
        "match_reason": "Current active safety report triggering surveillance correlation"
    }
    all_related_reports = [current_report_summary] + matching_reports_info

    return {
        "weak_signal_detected": True,
        "weak_signal_id": active_signal.signal_id,
        "weak_signal_title": active_signal.title,
        "weak_signal_reason": active_signal.detection_reason,
        "escalation_path": active_signal.escalation_path,
        "related_reports": all_related_reports,
        "weak_signals": [structured_signal]
    }
