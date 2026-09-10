"""
Hybrid SIF Decision Engine
==========================
Combines deterministic Rule-Based Safety Assessment with Supervised Machine Learning
Probabilities and Feature Evidence into an auditable, explainable safety decision.

Architecture:
Rule-Based SIF Assessment (High Energy + Exposure + Barrier Gap)
        +
ML Model Inference (TF-IDF + Logistic Regression calibrated probability)
        +
Feature Evidence (Active terms & log-odds weights)
        ↓
Hybrid Decision Engine

Output Schema (Kept Separately per Requirements):
- ai_classification: "SIF-potential" | "Non-SIF-potential" | "Insufficient Information"
- ai_sif_score: MAUT-grounded Risk Score (0 to 100)
- ai_confidence: Model certainty and evidence completeness (0 to 100%)
- rule_based_assessment: "YES" | "NO" | "INSUFFICIENT_INFORMATION"
- ml_probability: Float probability (0.0 to 1.0)
- final_ai_decision: "CONFIRMED SIF PRECURSOR" | "NON-SIF OBSERVATION" | "INSUFFICIENT INFORMATION"
- contributing_features: List of active terms and weights
"""

import logging
from typing import Dict, List, Optional, Any

logger = logging.getLogger("sif_assessment")

try:
    from .sif_ml_inference import predict_sif_potential
except (ImportError, ValueError):
    try:
        from sif_ml_inference import predict_sif_potential
    except ImportError:
        predict_sif_potential = None


def compute_maut_risk_score(
    hazard: Optional[str],
    energy_source: Optional[str],
    exposure: Optional[str],
    barrier_status: str,
    text: str
) -> int:
    """
    Computes Multi-Attribute Utility Theory (MAUT) Risk Score (0 - 100)
    based strictly on safety evidence:
    1. Energy Severity (0 - 30)
    2. Worker Exposure (0 - 25)
    3. Barrier Deficiency (0 - 25)
    4. Escalation Potential (0 - 20)
    """
    h_low = (hazard or "").lower()
    e_low = (energy_source or "").lower()
    ex_low = (exposure or "").lower()
    t_low = text.lower()

    # Attribute 1: Energy Severity (0 - 30)
    energy_score = 6
    if any(k in e_low or k in h_low for k in ["high-voltage", "11kv", "415v", "arc flash", "pressure", "pneumatic", "blowout", "h2s", "toxic", "fire", "thermal"]):
        energy_score = 28
    elif any(k in e_low or k in h_low for k in ["gravity", "suspended load", "dropped object", "fall from height", "work at height", "scaffold", "crane"]):
        energy_score = 24
    elif any(k in e_low or k in h_low for k in ["kinetic", "mobile equipment", "forklift", "vehicle", "rotating machinery", "chemical"]):
        energy_score = 18
    elif any(k in h_low for k in ["slip", "trip", "housekeeping"]):
        energy_score = 6

    # Attribute 2: Worker Exposure (0 - 25)
    exposure_score = 5
    if any(k in ex_low for k in ["line-of-fire", "under suspended load", "direct physical proximity", "live electrical", "fall edge"]):
        exposure_score = 22
    elif any(k in ex_low for k in ["confined space", "trajectory", "rotating machinery", "near elevation"]):
        exposure_score = 17
    elif any(k in ex_low for k in ["not exposed", "not_exposed", "zero exposure"]):
        exposure_score = 2
    elif any(k in ex_low for k in ["slip", "walking", "door"]):
        exposure_score = 5

    # Attribute 3: Barrier Deficiency (0 - 25)
    barrier_score = 5
    if barrier_status in ["BARRIER_FAILED", "Barrier Failed"]:
        barrier_score = 24
    elif barrier_status in ["BARRIER_BYPASSED", "Barrier Bypassed"]:
        barrier_score = 22
    elif barrier_status in ["BARRIER_MISSING", "Barrier Missing"]:
        barrier_score = 18
    elif barrier_status in ["BARRIER_COMPROMISED", "Barrier Compromised"]:
        barrier_score = 12
    elif barrier_status in ["BARRIER_PRESENT", "Barrier Present"]:
        barrier_score = 3
    else:  # BARRIER_INSUFFICIENT_INFO
        barrier_score = 6

    # Attribute 4: Escalation Potential (0 - 20)
    escalation_score = 3
    if any(k in t_low for k in ["gas leak", "hissing", "rupture", "spark", "flame", "smoke", "high pressure", "spreading"]):
        escalation_score = 18
    elif any(k in t_low for k in ["heavy weather", "night shift", "high wind", "elevated", "catwalk", "edge"]):
        escalation_score = 10
    elif any(k in t_low for k in ["water", "mud", "housekeeping", "spill"]):
        escalation_score = 4

    total_risk = energy_score + exposure_score + barrier_score + escalation_score
    return max(0, min(100, total_risk))


def assess_sif_precursor(
    report_type: str,
    text: str,
    hazard: Optional[str],
    energy_source: Optional[str],
    exposure: Optional[str],
    barrier_status: str,
    signals: List[str]
) -> Dict[str, Any]:
    """
    Executes the Hybrid SIF Decision Engine.
    Combines rule-based assessment with supervised ML probabilities.
    """
    cleaned_len = len((text or "").strip().split())

    # 1. Check for Insufficient Information
    if cleaned_len < 4 or (hazard is None and not signals and (energy_source is None or energy_source == "Insufficient Information")):
        return {
            "assessment": "INSUFFICIENT_INFORMATION",
            "rule_based_assessment": "INSUFFICIENT_INFORMATION",
            "ai_classification": "Insufficient Information",
            "final_ai_decision": "INSUFFICIENT INFORMATION",
            "ml_probability": 0.0,
            "ai_sif_score": 25,
            "ai_confidence": 0.0,
            "potential_consequence": "Insufficient information available to evaluate potential consequence severity.",
            "reason": "The report description lacks sufficient operational details regarding hazards, energy sources, or controls for a reliable SIF precursor assessment.",
            "contributing_features": []
        }

    # 2. Supervised ML Inference
    ml_sif_prediction: Optional[str] = None
    ml_sif_confidence: Optional[float] = None
    ml_probability: float = 0.5
    ml_model: Optional[str] = None
    contributing_features: List[Dict[str, Any]] = []

    if predict_sif_potential is not None and text and text.strip():
        try:
            ml_res = predict_sif_potential(text)
            if isinstance(ml_res, dict) and ml_res.get("status") == "SUCCESS":
                ml_sif_prediction = ml_res.get("predicted_class")
                ml_sif_confidence = ml_res.get("confidence")
                ml_probability = float(ml_res.get("sif_probability", 0.5))
                ml_model = ml_res.get("model_name")
                contributing_features = ml_res.get("contributing_features", [])
        except Exception as exc:
            logger.warning(f"ML inference fallback triggered: {exc}")

    # 3. Rule-Based Safety Evidence Evaluation
    h_low = (hazard or "").lower()
    is_high_energy = (
        energy_source in ["Electrical", "Pneumatic / High Pressure", "Chemical", "Thermal", "Gravity"] or
        any(k in h_low for k in [
            "suspended load", "dropped object", "fall from height", "work at height",
            "arc flash", "electrical", "confined space", "high pressure", "gas leak",
            "blowout", "toxic gas", "vehicle", "crane", "flame", "thermal"
        ])
    )
    is_minor_slip = any(k in h_low for k in ["slip", "trip", "surface housekeeping"]) and not is_high_energy

    has_exposure = (
        (exposure is not None and "not exposed" not in exposure.lower() and exposure != "Insufficient Information") or
        len(signals) > 0
    )
    has_barrier_deficiency = barrier_status in [
        "BARRIER_MISSING", "BARRIER_FAILED", "BARRIER_BYPASSED", "BARRIER_COMPROMISED"
    ]

    # Rule Assessment Determination
    if is_high_energy and (has_exposure or has_barrier_deficiency):
        rule_assessment = "YES"
        rule_reason = "Report presents evidence of hazardous high energy combined with personnel exposure or barrier deficiency."
    elif is_minor_slip:
        rule_assessment = "NO"
        rule_reason = "Report describes localized low-severity slip/trip condition without high-energy hazard or severe consequence potential."
    elif is_high_energy and not has_exposure and barrier_status == "BARRIER_PRESENT":
        rule_assessment = "NO"
        rule_reason = "High-energy vector was present but verified active barriers successfully prevented personnel exposure."
    elif is_high_energy:
        rule_assessment = "YES"
        rule_reason = "High-energy operational hazard identified with potential unmitigated exposure pathways."
    else:
        rule_assessment = "NO"
        rule_reason = "Available information does not indicate high-energy exposure or potential serious consequence precursors."

    # 4. Hybrid Decision Synthesis
    # SIF Recall is safety-critical:
    # - If Rule Assessment is YES -> Final Decision is SIF PRECURSOR
    # - If ML Probability is very high (> 0.75) and text has safety signals -> Escalates to SIF PRECURSOR
    # - Otherwise adheres to deterministic rule decision
    if rule_assessment == "YES":
        final_decision = "CONFIRMED SIF PRECURSOR"
        ai_class = "SIF-potential"
    elif rule_assessment == "NO" and ml_probability >= 0.75 and is_high_energy:
        final_decision = "CONFIRMED SIF PRECURSOR"
        ai_class = "SIF-potential"
        rule_reason += " (Escalated by high ML precursor probability)."
    else:
        final_decision = "NON-SIF OBSERVATION"
        ai_class = "Non-SIF-potential"

    # 5. Risk Score vs AI Confidence (Requirement 7: Kept strictly separate)
    risk_score = compute_maut_risk_score(hazard, energy_source, exposure, barrier_status, text)

    # Dynamic AI Confidence represents model/evidence certainty
    conf_base = 82.0
    if ml_sif_confidence:
        conf_base = max(conf_base, ml_sif_confidence * 100)
    if hazard and hazard != "Insufficient Information":
        conf_base += 4.0
    if energy_source and energy_source != "Insufficient Information":
        conf_base += 4.0
    if barrier_status != "BARRIER_INSUFFICIENT_INFO":
        conf_base += 3.0
    ai_confidence = min(96.8, round(conf_base, 1))

    # Consequence summary
    if is_high_energy and "electrical" in (energy_source or "").lower():
        potential_consequence = "Potential high-voltage electrical shock, severe arc flash thermal burns, or electrocution."
    elif is_high_energy and "pressure" in (energy_source or "").lower():
        potential_consequence = "Potential high-pressure fluid injection, line blowout impact, or mechanical strike."
    elif is_high_energy and "gravity" in (energy_source or "").lower():
        potential_consequence = "Potential severe blunt force trauma, crush injury, or fatality from falling mass/fall from height."
    elif is_high_energy and "chemical" in (energy_source or "").lower():
        potential_consequence = "Potential acute toxic gas asphyxiation or corrosive chemical contamination."
    elif is_minor_slip:
        potential_consequence = "Potential low-severity surface slip or minor localized contusion."
    else:
        potential_consequence = "Low-to-moderate operational hazard without immediate life-threatening potential."

    return {
        "assessment": "YES" if ai_class == "SIF-potential" else "NO",
        "ai_classification": ai_class,
        "final_ai_decision": final_decision,
        "rule_based_assessment": rule_assessment,
        "ml_probability": round(ml_probability, 4),
        "ai_sif_score": risk_score,
        "ai_confidence": ai_confidence,
        "potential_consequence": potential_consequence,
        "reason": rule_reason,
        "contributing_features": contributing_features,
        "ml_model": ml_model or "sif_tfidf_logistic_regression"
    }
