from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from sqlalchemy.orm import Session
from ..models.safety_report import SafetyReport, AnalysisStatusEnum
from ..models.ai_analysis import AIAnalysis
from ..models.user import User
from ..ai_services.ai_service import analyze_safety_report
from ..schemas.ai_analysis import AIAnalysisResponse, AIAnalysisRequest, AIAnalysisExecuteResponse
from ..schemas.safety_report import SafetyReportCreate
from .report_service import find_duplicate_report, create_report
from .historical_pattern_service import detect_and_update_weak_signals

def execute_ai_analysis(db: Session, report: SafetyReport) -> AIAnalysis:
    """
    Executes AI analysis for a safety report and persists explainable structured results.
    """
    report.analysis_status = AnalysisStatusEnum.PROCESSING.value
    db.commit()

    try:
        # Run 10-step AI pipeline
        raw_result = analyze_safety_report(
            report_type=report.report_type,
            description=report.description,
            additional_context=report.additional_context
        )

        # Check if existing analysis exists for re-runs
        analysis = db.query(AIAnalysis).filter(AIAnalysis.report_id == report.id).first()
        if not analysis:
            analysis = AIAnalysis(
                report_id=report.id,
                organization_id=report.organization_id,
                analysis_context=raw_result["analysis_context"],
                identified_action=raw_result["identified_action"],
                identified_condition=raw_result["identified_condition"],
                identified_event=raw_result["identified_event"],
                identified_hazard=raw_result["identified_hazard"],
                safety_signals=raw_result["safety_signals"],
                energy_source=raw_result["energy_source"],
                exposure=raw_result["exposure"],
                barrier_information=raw_result["barrier_information"],
                potential_consequence=raw_result["potential_consequence"],
                sif_precursor_assessment=raw_result["sif_precursor_assessment"],
                explanation=raw_result["explanation"]
            )
            db.add(analysis)
        else:
            analysis.analysis_context = raw_result["analysis_context"]
            analysis.identified_action = raw_result["identified_action"]
            analysis.identified_condition = raw_result["identified_condition"]
            analysis.identified_event = raw_result["identified_event"]
            analysis.identified_hazard = raw_result["identified_hazard"]
            analysis.safety_signals = raw_result["safety_signals"]
            analysis.energy_source = raw_result["energy_source"]
            analysis.exposure = raw_result["exposure"]
            analysis.barrier_information = raw_result["barrier_information"]
            analysis.potential_consequence = raw_result["potential_consequence"]
            analysis.sif_precursor_assessment = raw_result["sif_precursor_assessment"]
            analysis.explanation = raw_result["explanation"]

        report.analysis_status = AnalysisStatusEnum.COMPLETED.value
        db.commit()
        db.refresh(analysis)
        return analysis

    except Exception as e:
        report.analysis_status = AnalysisStatusEnum.FAILED.value
        db.commit()
        raise e

def get_organization_analyses(db: Session, org_id: str):
    """Retrieves all completed AI analyses for the organization."""
    return db.query(AIAnalysis).filter(AIAnalysis.organization_id == org_id).all()

def execute_direct_analysis(
    db: Session,
    current_user: User,
    request: AIAnalysisRequest
) -> AIAnalysisExecuteResponse:
    """
    Executes the current main 10-step AI NLP engine on an observation,
    enforces duplicate prevention via Issue #11 composite key,
    persists the SafetyReport and its AIAnalysis in SQLite if new,
    and returns the rich structured response.
    """
    description = request.report_text.strip()
    location = (request.location or "Unit 1").strip()
    norm_type = (request.report_type or "NEAR_MISS").strip().upper().replace("-", "_").replace(" ", "_")
    if norm_type not in ["UNSAFE_ACT", "UNSAFE_CONDITION", "NEAR_MISS"]:
        norm_type = "NEAR_MISS"
    report_date = (request.report_date or datetime.utcnow().strftime("%Y-%m-%d")).strip()

    # 1. Run the real current main 10-step AI NLP engine
    raw_result = analyze_safety_report(
        report_type=norm_type,
        description=description,
        additional_context=request.additional_context
    )

    # Dynamic Location Extraction: prioritize explicit request location, then text extracted location
    extracted_loc = raw_result.get("extracted_entities", {}).get("location")
    invalid_locs = ["unknown", "insufficient information", "not identified", "none", "n/a", ""]
    
    if request.location and request.location.strip() and request.location.strip().lower() not in invalid_locs:
        location = request.location.strip()
    elif extracted_loc and extracted_loc.strip() and extracted_loc.strip().lower() not in invalid_locs:
        location = extracted_loc.strip()
    else:
        location = (request.location or "Unit 1").strip()

    # 2. Extract Life-Saving Rules
    lsr_info = raw_result.get("life_saving_rule")
    if isinstance(lsr_info, dict) and lsr_info.get("rule_name"):
        iogp_rule = f"{lsr_info['rule_name']} ({lsr_info.get('rule_code', 'LSR')})"
    else:
        iogp_rule = None

    # 3. Determine SIF classification & dynamic risk metrics (strictly from pipeline)
    sif_status = raw_result.get("sif_precursor_assessment", "NO")
    is_sif = sif_status == "YES"
    determination_status = raw_result.get("final_ai_decision", "CONFIRMED SIF PRECURSOR" if is_sif else "NON-SIF OBSERVATION")
    risk_score = raw_result.get("ai_sif_score", 25 if not is_sif else 85)
    confidence = raw_result.get("ai_confidence", 85.0)

    # 4. Extract hazards & energy vectors
    hazards: List[str] = []
    if raw_result.get("identified_hazard"):
        hazards.append(raw_result["identified_hazard"])
    if raw_result.get("exposure") and raw_result.get("exposure") != "Insufficient Information":
        hazards.append(f"Exposure Vector: {raw_result['exposure']}")
    if raw_result.get("safety_signals"):
        for sig in raw_result["safety_signals"]:
            hazards.append(f"Detected Safety Signal: {sig}")
    if not hazards:
        if is_sif:
            hazards.append("High Potential Energy Vector")
        elif sif_status == "INSUFFICIENT_INFORMATION":
            hazards.append("Indeterminate Hazard / Insufficient Information")
        else:
            hazards.append("General Operational Observation")

    high_energy_vectors: List[str] = []
    energy_source_raw = raw_result.get("energy_source")
    if energy_source_raw and energy_source_raw not in ["Not identified / Insufficient Information", "None Identified"]:
        high_energy_vectors.append(energy_source_raw)

    # 5. Barrier status description
    barrier_eval = raw_result.get("barrier_information")
    if barrier_eval == "BARRIER_MISSING":
        barrier_status_desc = "Missing / Not Deployed"
    elif barrier_eval == "BARRIER_FAILED":
        barrier_status_desc = "Failed / Mechanical Rupture"
    elif barrier_eval == "BARRIER_BYPASSED":
        barrier_status_desc = "Bypassed / Overridden"
    elif barrier_eval == "BARRIER_COMPROMISED":
        barrier_status_desc = "Compromised / Degraded"
    elif barrier_eval == "BARRIER_PRESENT":
        barrier_status_desc = "Intact / Functioning"
    else:
        barrier_status_desc = "Insufficient Information"

    # 6. Actionable recommendations & CAPA
    h_lower = (raw_result.get("identified_hazard") or "").lower()
    t_lower = description.lower()
    if "slip" in h_lower or "slip" in t_lower or "slippery" in t_lower:
        recommended_controls = [
            "Inspect and rectify the slippery surface, identify the source of moisture/oil.",
            "Provide warning signage and prevent pedestrian exposure until corrected.",
            "Clean and dry the affected area immediately with compatible absorbent.",
            "Verify the area during routine post-shift safety inspection."
        ]
        corrective_actions = [
            "Rectify drainage defect or fluid source causing surface slickness.",
            "Log routine maintenance inspection in CMMS ledger."
        ]
    elif "water" in t_lower and ("electrical" in t_lower or "panel" in t_lower):
        recommended_controls = [
            "De-energize electrical panel immediately and establish barrier cordon.",
            "Identify and isolate the source of water leakage.",
            "Inspect panel enclosure for water ingress and perform insulation resistance test.",
            "Verify dry, safe conditions before restoring electrical power."
        ]
        corrective_actions = [
            "Permanent pipe/roof repair to eliminate water path above electrical gear.",
            "Recertify electrical insulation integrity before re-energizing."
        ]
    elif "exit" in t_lower or "egress" in h_lower or "blocked" in t_lower:
        recommended_controls = [
            "Immediately clear designated emergency exit and evacuation route.",
            "Remove all stored obstructions, boxes, and materials from doorway.",
            "Conduct walkdown of all emergency egress pathways in facility.",
            "Brief area shift personnel on maintaining 100% unobstructed exit access."
        ]
        corrective_actions = [
            "Mark floor with yellow hatching 'Keep Clear At All Times'.",
            "Audit facility egress compliance during weekly safety committee walk."
        ]
    elif "helmet" in t_lower or "head" in h_lower or ("ppe" in h_lower and "without" in t_lower):
        recommended_controls = [
            "Provide required safety helmet immediately before worker continues task.",
            "Brief frontline team on mandatory 100% PPE compliance in operational areas.",
            "Verify all personnel on shift are equipped with inspected PPE.",
            "Document observation in shift safety briefing log."
        ]
        corrective_actions = [
            "Conduct shift safety stand-down on Life-Saving Rule personal accountability.",
            "Ensure contractor supervisor enforces pre-task PPE checks."
        ]
    elif "tools" in t_lower or "housekeeping" in h_lower or "stacked" in t_lower:
        recommended_controls = [
            "Clear unattended tools and materials from walkway immediately.",
            "Restack materials and boxes within designated weight and height limits.",
            "Conduct routine housekeeping walkdown across working area.",
            "Ensure tools are stored in designated tool racks or containers."
        ]
        corrective_actions = [
            "Implement 5S housekeeping standard across working bays.",
            "Verify aisle clearance during end-of-shift handover."
        ]
    elif is_sif:
        recommended_controls = [
            "Immediately trigger Emergency Shutdown (ESD) or line isolation valve",
            "Evacuate personnel upwind and establish a 50-meter safety exclusion zone",
            "Conduct continuous multi-gas / zero-energy verification before re-entry",
            "Depressurize and lock-out / tag-out all upstream energy sources"
        ]
        corrective_actions = [
            "Issue Stop-Work Notice and stand down operating shift team",
            "Dispatch Field HSE Superintendent for barrier integrity inspection",
            "Log high-priority CAPA item in corporate safety intelligence system"
        ]
    else:
        recommended_controls = [
            "Conduct immediate walkdown inspection to identify hazard root cause",
            "Implement appropriate physical controls and warning demarcation",
            "Verify area condition during regular shift safety inspections",
            "Log findings in facility safety maintenance tracking register"
        ]
        corrective_actions = [
            "Log routine maintenance inspection in CMMS ledger",
            "Review standard operating procedures with shift crew"
        ]

    # Report Name
    if request.report_name and request.report_name.strip():
        report_name = request.report_name.strip()
    elif raw_result.get("identified_hazard"):
        report_name = raw_result["identified_hazard"]
    else:
        report_name = f"{norm_type.replace('_', ' ').title()} Observation ({location})"

    # 7. Check for duplicate using Issue #11 composite duplicate key
    description_for_report = description[:100]
    extra_context = request.additional_context
    if not extra_context and len(description) > 100:
        extra_context = description[100:]

    report_create = SafetyReportCreate(
        report_type=norm_type,
        description=description_for_report,
        location=location,
        report_date=report_date,
        additional_context=extra_context
    )

    duplicate = find_duplicate_report(db, current_user.organization_id, report_create)
    is_duplicate = False
    if duplicate:
        report = duplicate
        is_duplicate = True
        message = f"Observation matches existing report {report.report_reference}. Reusing existing analysis."
        # Ensure analysis exists for duplicate
        analysis = db.query(AIAnalysis).filter(AIAnalysis.report_id == report.id).first()
        if not analysis:
            analysis = execute_ai_analysis(db, report)
    else:
        # Create and persist new report in SQLite database
        report = create_report(db, report_create, current_user)
        analysis = execute_ai_analysis(db, report)
        message = f"Report created and persisted as {report.report_reference}."

    db.refresh(report)

    # Dynamic Historical Comparison & Weak Signal Detection
    try:
        ws_res = detect_and_update_weak_signals(
            db=db,
            org_id=current_user.organization_id,
            current_report=report,
            raw_nlp_result=raw_result
        )
    except Exception as ws_err:
        ws_res = {
            "weak_signal_detected": False,
            "weak_signal_id": None,
            "weak_signal_title": None,
            "weak_signal_reason": f"Historical pattern analysis unavailable: {str(ws_err)}",
            "escalation_path": None,
            "related_reports": [],
            "weak_signals": []
        }

    explanation_text = raw_result.get("explanation") or ""
    if is_sif:
        default_energy = "High-Pressure Hydrocarbon Vector"
    elif sif_status == "INSUFFICIENT_INFORMATION":
        default_energy = "Indeterminate Energy Vector (Insufficient Data)"
    else:
        default_energy = "Low Kinetic / Surface Hydrostatic Energy (< 100 J)"
    energy_val = raw_result.get("energy_source") or default_energy

    if is_sif:
        default_lsr = "Line of Fire (LSR-04) & Energy Isolation (LSR-01)"
    elif sif_status == "INSUFFICIENT_INFORMATION":
        default_lsr = "Not Applicable (Insufficient Information)"
    else:
        default_lsr = "General Workplace Housekeeping Standards"

    return AIAnalysisExecuteResponse(
        report_id=report.id,
        report_reference=report.report_reference,
        report_name=report_name,
        sif_precursor=sif_status if sif_status in ["YES", "NO", "INSUFFICIENT_INFORMATION"] else "NO",
        determination_status=determination_status,
        confidence=confidence,
        risk_score=risk_score,
        sif_potential_score=risk_score,
        classification=norm_type,
        hazard=raw_result.get("identified_hazard"),
        detected_hazards=hazards,
        detected_high_energy_vectors=high_energy_vectors,
        energy_vector=energy_val,
        energy_source=energy_val,
        worker_exposure=raw_result.get("exposure"),
        barrier_status=barrier_status_desc,
        life_saving_rule=iogp_rule or default_lsr,
        iogp_rule=iogp_rule or default_lsr,
        explainable_reasoning=explanation_text,
        explanation=explanation_text,
        why_identified={"summary": explanation_text},
        recommended_actions={
            "immediate_actions": [{"action": c} for c in recommended_controls],
            "corrective_actions": [{"action": a} for a in corrective_actions]
        },
        recommended_controls=recommended_controls,
        corrective_actions=corrective_actions,
        weak_signals=ws_res.get("weak_signals", []),
        weak_signal_detected=ws_res.get("weak_signal_detected", False),
        weak_signal_id=ws_res.get("weak_signal_id"),
        weak_signal_title=ws_res.get("weak_signal_title"),
        weak_signal_reason=ws_res.get("weak_signal_reason"),
        related_reports=ws_res.get("related_reports", []),
        escalation_path=ws_res.get("escalation_path"),
        ai_classification=raw_result.get("ai_classification", "Non-SIF-potential"),
        ai_sif_score=raw_result.get("ai_sif_score", risk_score),
        ai_confidence=raw_result.get("ai_confidence", confidence),
        rule_based_assessment=raw_result.get("rule_based_assessment", "NO"),
        ml_probability=raw_result.get("ml_probability", 0.0),
        final_ai_decision=raw_result.get("final_ai_decision", determination_status),
        contributing_features=raw_result.get("contributing_features", []),
        human_classification=None,
        human_sif_score=None,
        reviewer_feedback=None,
        review_status="Pending Review",
        is_duplicate=is_duplicate,
        is_unrelated=False,
        message=message,
        created_at=report.created_at
    )
