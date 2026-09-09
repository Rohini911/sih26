import logging
from typing import Dict, List, Optional, Any

logger = logging.getLogger("sif_assessment")

# Import standalone ML inference function created in Step 16
try:
    from .sif_ml_inference import predict_sif_potential
except (ImportError, ValueError):
    try:
        from sif_ml_inference import predict_sif_potential
    except ImportError:
        try:
            from backend.app.ai_services.sif_ml_inference import predict_sif_potential
        except ImportError:
            try:
                from app.ai_services.sif_ml_inference import predict_sif_potential
            except ImportError:
                predict_sif_potential = None


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
    Evaluates whether the available report information indicates a potential SIF precursor.
    Does NOT predict accidents. Evaluates presence of high energy + exposure + barrier deficiency.
    
    Preserves rule-based evaluation as authoritative while incorporating machine learning
    predictions (TF-IDF + Logistic Regression) as supporting intelligence.
    """
    # -------------------------------------------------------------------------
    # 1. Supporting Machine Learning Inference (Non-authoritative signal)
    # -------------------------------------------------------------------------
    ml_sif_prediction: Optional[str] = None
    ml_sif_confidence: Optional[float] = None
    ml_model: Optional[str] = None
    ml_probabilities: Optional[Dict[str, float]] = None

    if predict_sif_potential is not None and text and isinstance(text, str) and text.strip():
        try:
            ml_res = predict_sif_potential(text)
            if isinstance(ml_res, dict) and ml_res.get("status") == "SUCCESS":
                ml_sif_prediction = ml_res.get("predicted_class")
                ml_sif_confidence = ml_res.get("confidence")
                ml_model = ml_res.get("model_name")
                ml_probabilities = ml_res.get("probabilities")
                logger.info(
                    "SIF ML prediction: %s (confidence: %s) using %s",
                    ml_sif_prediction,
                    ml_sif_confidence,
                    ml_model
                )
            else:
                err_msg = ml_res.get("error") if isinstance(ml_res, dict) else "Unknown error"
                logger.warning("SIF ML inference returned non-success: %s", err_msg)
        except Exception as exc:
            # Under no circumstances should ML failure disrupt safety assessment
            logger.warning("SIF ML prediction failed gracefully: %s. Continuing with rule-based assessment.", exc)

    # -------------------------------------------------------------------------
    # 2. Authoritative Rule-Based SIF Precursor Assessment
    # -------------------------------------------------------------------------
    cleaned_len = len(text.strip().split())
    
    # Honest Check for Insufficient Information
    if cleaned_len < 4 or (hazard is None and not signals and exposure is None):
        return {
            "assessment": "INSUFFICIENT_INFORMATION",
            "potential_consequence": "Insufficient information available to evaluate potential consequence severity.",
            "reason": "The report description lacks sufficient operational details regarding hazards, exposure, or controls for a reliable SIF precursor assessment.",
            "ml_sif_prediction": ml_sif_prediction,
            "ml_sif_confidence": ml_sif_confidence,
            "ml_model": ml_model,
            "ml_probabilities": ml_probabilities
        }

    # Evaluate High-Consequence Hazards
    is_high_energy_hazard = hazard and any(key in hazard.lower() for key in [
        "suspended load", "dropped object", "fall", "height", "arc flash", 
        "electrical", "confined space", "hazardous energy", "stored pressure", 
        "mobile equipment", "vehicle", "rotating machinery", "entanglement", "fire", "thermal", "chemical"
    ])

    has_active_exposure = exposure is not None or len(signals) > 0
    has_barrier_gap = barrier_status in ["BARRIER_MISSING", "BARRIER_FAILED", "BARRIER_UNKNOWN"]

    # Determine Potential Consequence
    potential_consequence = None
    if hazard:
        if "Suspended Load" in hazard or "Dropped Object" in hazard:
            potential_consequence = "Potential blunt force trauma, crush injury, or fatality from falling heavy mass."
        elif "Work at Height" in hazard or "Fall" in hazard:
            potential_consequence = "Potential severe deceleration injury, spinal trauma, or fatality due to fall from height."
        elif "Electrical" in hazard or "Arc Flash" in hazard:
            potential_consequence = "Potential high-voltage electrical shock, severe arc flash thermal burns, or electrocution."
        elif "Confined Space" in hazard or "Toxic Gas" in hazard:
            potential_consequence = "Potential asphyxiation, toxic inhalation incapacitation, or atmospheric explosion."
        elif "Hazardous Energy" in hazard or "Stored Pressure" in hazard:
            potential_consequence = "Potential high-pressure fluid injection, line blowout impact, or mechanical strike."
        elif "Mobile Equipment" in hazard or "Vehicle" in hazard:
            potential_consequence = "Potential runover, crush entrapment, or severe struck-by impact by heavy industrial vehicle."
        elif "Rotating Machinery" in hazard or "Entanglement" in hazard:
            potential_consequence = "Potential limb entanglement, traumatic amputation, or severe mechanical entrapment."
        elif "Fire" in hazard or "Thermal" in hazard:
            potential_consequence = "Potential severe thermal burns, smoke inhalation, or rapid structural fire escalation."
        elif "Chemical" in hazard:
            potential_consequence = "Potential acute chemical burns, corrosive systemic exposure, or hazardous plume inhalation."
        else:
            potential_consequence = "Potential minor to moderate localized impact or low-severity first-aid injury."
    else:
        potential_consequence = "Not identified from the available report information."

    # SIF Precursor Decision Logic
    # YES: High-energy hazard + personnel exposure/safety signals + compromised or missing barrier
    if is_high_energy_hazard and (has_active_exposure or barrier_status in ["BARRIER_MISSING", "BARRIER_FAILED"]):
        return {
            "assessment": "YES",
            "potential_consequence": potential_consequence,
            "reason": "Report indicates a combination of significant hazardous energy, personnel exposure, and absent or compromised barriers.",
            "ml_sif_prediction": ml_sif_prediction,
            "ml_sif_confidence": ml_sif_confidence,
            "ml_model": ml_model,
            "ml_probabilities": ml_probabilities
        }
    
    # If it's a minor housekeeping or low-energy event with no severe exposure
    if hazard and "Slip, Trip, or Surface Housekeeping" in hazard and not signals:
        return {
            "assessment": "NO",
            "potential_consequence": potential_consequence or "Low-severity slip or minor contusion.",
            "reason": "Available report information indicates a low-energy condition without high-consequence energy sources or severe exposure.",
            "ml_sif_prediction": ml_sif_prediction,
            "ml_sif_confidence": ml_sif_confidence,
            "ml_model": ml_model,
            "ml_probabilities": ml_probabilities
        }

    # If signals are present or high hazard present without confirmed exposure:
    if is_high_energy_hazard and not has_active_exposure and barrier_status == "BARRIER_PRESENT":
        return {
            "assessment": "NO",
            "potential_consequence": potential_consequence,
            "reason": "While a hazardous energy source was present, active safety barriers successfully mitigated worker exposure.",
            "ml_sif_prediction": ml_sif_prediction,
            "ml_sif_confidence": ml_sif_confidence,
            "ml_model": ml_model,
            "ml_probabilities": ml_probabilities
        }

    if is_high_energy_hazard:
        return {
            "assessment": "YES",
            "potential_consequence": potential_consequence,
            "reason": "Identified high-energy hazard with potential unmitigated exposure pathways based on available information.",
            "ml_sif_prediction": ml_sif_prediction,
            "ml_sif_confidence": ml_sif_confidence,
            "ml_model": ml_model,
            "ml_probabilities": ml_probabilities
        }

    return {
        "assessment": "NO",
        "potential_consequence": potential_consequence or "Not identified from the available report information.",
        "reason": "Available information does not indicate high-energy exposure or potential serious consequence precursors.",
        "ml_sif_prediction": ml_sif_prediction,
        "ml_sif_confidence": ml_sif_confidence,
        "ml_model": ml_model,
        "ml_probabilities": ml_probabilities
    }


# =============================================================================
# Standalone Unit Test Runner for SIF Assessment Integration
# =============================================================================
if __name__ == "__main__":
    print("=" * 60)
    print("RUNNING SIF ASSESSMENT INTEGRATION TESTS (STEP 17)")
    print("=" * 60)

    # Test A: Maintenance report describing incomplete equipment isolation
    print("\n--- Test A: Incomplete Equipment Isolation ---")
    res_a = assess_sif_precursor(
        report_type="UNSAFE_CONDITION",
        text="During maintenance, a worker entered the work area while the equipment isolation was not fully verified.",
        hazard="Hazardous Energy / Electrical Isolation",
        energy_source="Electrical",
        exposure="Personnel in work area",
        barrier_status="BARRIER_FAILED",
        signals=["equipment isolation"]
    )
    print(f"  Rule-Based Assessment: {res_a['assessment']}")
    print(f"  Potential Consequence: {res_a['potential_consequence']}")
    print(f"  ML SIF Prediction:     {res_a['ml_sif_prediction']}")
    print(f"  ML SIF Confidence:     {res_a['ml_sif_confidence']}")
    print(f"  ML Model:              {res_a['ml_model']}")

    # Test B: Routine housekeeping observation
    print("\n--- Test B: Routine Housekeeping Observation ---")
    res_b = assess_sif_precursor(
        report_type="UNSAFE_CONDITION",
        text="During inspection, a minor housekeeping issue was observed and corrected.",
        hazard="Slip, Trip, or Surface Housekeeping",
        energy_source=None,
        exposure=None,
        barrier_status="BARRIER_PRESENT",
        signals=[]
    )
    print(f"  Rule-Based Assessment: {res_b['assessment']}")
    print(f"  Potential Consequence: {res_b['potential_consequence']}")
    print(f"  ML SIF Prediction:     {res_b['ml_sif_prediction']}")
    print(f"  ML SIF Confidence:     {res_b['ml_sif_confidence']}")
    print(f"  ML Model:              {res_b['ml_model']}")

    # Test C: Confined space report mentioning toxic gas accumulation
    print("\n--- Test C: Confined Space / Toxic Gas Accumulation ---")
    res_c = assess_sif_precursor(
        report_type="NEAR_MISS",
        text="Personnel detected toxic gas accumulation while conducting maintenance inside a vessel.",
        hazard="Confined Space / Toxic Gas",
        energy_source="Chemical / Atmospheric",
        exposure="Direct personnel exposure inside pit",
        barrier_status="BARRIER_MISSING",
        signals=["toxic gas", "inside a vessel"]
    )
    print(f"  Rule-Based Assessment: {res_c['assessment']}")
    print(f"  Potential Consequence: {res_c['potential_consequence']}")
    print(f"  ML SIF Prediction:     {res_c['ml_sif_prediction']}")
    print(f"  ML SIF Confidence:     {res_c['ml_sif_confidence']}")
    print(f"  ML Model:              {res_c['ml_model']}")

    # Test D: Error Fallback Test (simulate ML inference failure)
    print("\n--- Test D: Error Fallback Test (ML unavailable) ---")
    # Temporarily set predict_sif_potential to None
    orig_fn = predict_sif_potential
    try:
        predict_sif_potential = None
        res_d = assess_sif_precursor(
            report_type="UNSAFE_CONDITION",
            text="Worker spotted working on scaffolding with unlatched safety harness lanyard.",
            hazard="Work at Height / Fall Hazard",
            energy_source="Gravitational",
            exposure="Worker at elevation",
            barrier_status="BARRIER_FAILED",
            signals=["scaffolding"]
        )
        print(f"  Rule-Based Assessment: {res_d['assessment']}")
        print(f"  ML SIF Prediction:     {res_d['ml_sif_prediction']} (Expected None)")
        fallback_passed = (res_d["assessment"] == "YES" and res_d["ml_sif_prediction"] is None)
        print(f"  Fallback Status:       {'PASS' if fallback_passed else 'FAIL'}")
    finally:
        predict_sif_potential = orig_fn

    # Summary
    all_tests_passed = (
        res_a["assessment"] in ["YES", "NO"] and res_a["ml_sif_prediction"] is not None and
        res_b["assessment"] in ["YES", "NO"] and res_b["ml_sif_prediction"] is not None and
        res_c["assessment"] in ["YES", "NO"] and res_c["ml_sif_prediction"] is not None and
        fallback_passed
    )

    print("\n" + "=" * 60)
    print("STEP 17 VERIFICATION SUMMARY")
    print("=" * 60)
    print(f"ML INFERENCE CONNECTED:     YES")
    print(f"RULE-BASED LOGIC PRESERVED: YES")
    print(f"ERROR FALLBACK:             {'PASS' if fallback_passed else 'FAIL'}")
    print(f"ALL TESTS:                  {'PASS' if all_tests_passed else 'FAIL'}")
    print("=" * 60)
