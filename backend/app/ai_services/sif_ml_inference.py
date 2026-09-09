"""
SIF ML Inference Module
-----------------------
Standalone inference service for Serious Injury and Fatality (SIF) potential prediction
using the trained NLP pipeline (TF-IDF + Logistic Regression).

Model Artifact:
- ml/models/sif_v2_text_tfidf_logistic_regression.joblib

Features:
- Lazy singleton model loading (loaded once, reused for all requests)
- Robust model artifact path resolution across project execution contexts
- Strict validation for None, empty, or non-string inputs
- Class probability extraction via predict_proba()
- Clean dictionary response format without exposing internal filesystem paths
- Completely decoupled from frontend and existing AI response schemas
"""

import os
import logging
from pathlib import Path
from typing import Dict, Any, Optional
try:
    import joblib
except ImportError:
    joblib = None

logger = logging.getLogger("sif_ml_inference")

# Model configuration constants
MODEL_FILENAME = "sif_v2_text_tfidf_logistic_regression.joblib"
MODEL_NAME = "sif_v2_text_tfidf_logistic_regression"
MODEL_VERSION = "2.0.0"

# Module-level singleton container for lazy loading
_MODEL_PIPELINE = None
_MODEL_LOAD_ATTEMPTED = False
_MODEL_LOAD_ERROR: Optional[str] = None


def resolve_model_path() -> Optional[Path]:
    """
    Resolves the absolute path to the trained model artifact across various
    runtime execution contexts (e.g. backend root, project root, or environment override).
    
    Returns:
        Path if found and valid, otherwise None.
    """
    # 1. Check optional environment variable override
    env_path = os.environ.get("SIF_MODEL_PATH")
    if env_path:
        p = Path(env_path).resolve()
        if p.is_file():
            return p

    # 2. Derive candidate paths from __file__ location
    # __file__ is at: <project_root>/backend/app/ai_services/sif_ml_inference.py
    current_file = Path(__file__).resolve()
    
    # Project root is 4 levels up: ai_services -> app -> backend -> project_root
    try:
        project_root = current_file.parents[3]
    except IndexError:
        project_root = current_file.parent

    candidate_paths = [
        # Relative to project root
        project_root / "ml" / "models" / MODEL_FILENAME,
        # Relative to current working directory
        Path.cwd() / "ml" / "models" / MODEL_FILENAME,
        # Relative to parent of current working directory (if started from backend/)
        Path.cwd().parent / "ml" / "models" / MODEL_FILENAME,
        # Inside backend/ml/models if mirrored
        project_root / "backend" / "ml" / "models" / MODEL_FILENAME,
    ]

    for candidate in candidate_paths:
        if candidate.is_file():
            return candidate

    return None


def get_model():
    """
    Returns the loaded model pipeline singleton.
    Loads lazily upon the first request with thread-safe simplicity.
    Raises RuntimeError or FileNotFoundError if the model cannot be loaded.
    """
    global _MODEL_PIPELINE, _MODEL_LOAD_ATTEMPTED, _MODEL_LOAD_ERROR

    if _MODEL_PIPELINE is not None:
        return _MODEL_PIPELINE

    if _MODEL_LOAD_ATTEMPTED and _MODEL_LOAD_ERROR:
        # Previously attempted and failed; do not retry endlessly
        raise RuntimeError(_MODEL_LOAD_ERROR)

    _MODEL_LOAD_ATTEMPTED = True

    if joblib is None:
        _MODEL_LOAD_ERROR = "joblib is not installed in the environment."
        logger.warning(_MODEL_LOAD_ERROR)
        raise RuntimeError(_MODEL_LOAD_ERROR)

    model_path = resolve_model_path()
    if not model_path:
        _MODEL_LOAD_ERROR = "Model artifact file could not be found in expected directories."
        logger.error(_MODEL_LOAD_ERROR)
        raise FileNotFoundError(_MODEL_LOAD_ERROR)

    try:
        # Load the complete saved pipeline (TF-IDF Vectorizer + Logistic Regression)
        logger.info("Loading SIF ML pipeline singleton...")
        _MODEL_PIPELINE = joblib.load(model_path)
        logger.info("SIF ML pipeline loaded successfully.")
        return _MODEL_PIPELINE
    except Exception as e:
        _MODEL_LOAD_ERROR = f"Failed to load SIF ML model artifact: {str(e)}"
        logger.error(_MODEL_LOAD_ERROR)
        raise RuntimeError(_MODEL_LOAD_ERROR)


def predict_sif_potential(report_text: str) -> Dict[str, Any]:
    """
    Performs inference to predict SIF potential from raw report observation text.

    Args:
        report_text: The free-text description of the incident / observation.

    Returns:
        Dict containing:
            - status: "SUCCESS" | "INVALID_INPUT" | "MODEL_UNAVAILABLE" | "ERROR"
            - predicted_class: "SIF-potential" | "Non-SIF-potential" | None
            - confidence: float probability (0.0 to 1.0) | None
            - probabilities: dict of {class_label: float} | None
            - model_name: str
            - model_version: str
            - error: Optional error description (without internal filesystem paths)
    """
    # 1. Validate input safely
    if report_text is None or not isinstance(report_text, str):
        return {
            "status": "INVALID_INPUT",
            "predicted_class": None,
            "confidence": None,
            "probabilities": None,
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "error": "Report text must be a non-empty string.",
        }

    cleaned_text = report_text.strip()
    if not cleaned_text:
        return {
            "status": "INVALID_INPUT",
            "predicted_class": None,
            "confidence": None,
            "probabilities": None,
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "error": "Report text cannot be empty or whitespace only.",
        }

    # 2. Retrieve model pipeline singleton
    try:
        pipeline = get_model()
    except (FileNotFoundError, RuntimeError):
        return {
            "status": "MODEL_UNAVAILABLE",
            "predicted_class": None,
            "confidence": None,
            "probabilities": None,
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "error": "Machine learning model service is currently unavailable.",
        }
    except Exception:
        return {
            "status": "ERROR",
            "predicted_class": None,
            "confidence": None,
            "probabilities": None,
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "error": "Unexpected error accessing machine learning model.",
        }

    # 3. Run inference through the pipeline
    try:
        prediction = pipeline.predict([cleaned_text])[0]

        # Extract probabilities if available
        confidence = None
        probabilities = None

        if hasattr(pipeline, "predict_proba"):
            probs = pipeline.predict_proba([cleaned_text])[0]
            classes = getattr(pipeline, "classes_", [])
            if len(classes) == len(probs):
                probabilities = {
                    str(cls_name): round(float(prob), 4)
                    for cls_name, prob in zip(classes, probs)
                }
                # Confidence is the probability of the predicted class
                if prediction in probabilities:
                    confidence = probabilities[prediction]
                else:
                    confidence = round(float(max(probs)), 4)

        return {
            "status": "SUCCESS",
            "predicted_class": str(prediction),
            "confidence": confidence,
            "probabilities": probabilities,
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "error": None,
        }

    except Exception as e:
        logger.error(f"Prediction failure: {e}")
        return {
            "status": "ERROR",
            "predicted_class": None,
            "confidence": None,
            "probabilities": None,
            "model_name": MODEL_NAME,
            "model_version": MODEL_VERSION,
            "error": "Failed to complete prediction on the provided text.",
        }


# =====================================================================
# Standalone Unit Test Runner
# =====================================================================
if __name__ == "__main__":
    import json

    print("=" * 60)
    print("RUNNING STANDALONE SIF ML INFERENCE UNIT TESTS")
    print("=" * 60)

    # 1. Model Loading Test
    print("\n--- Test 1: Model Loading Test ---")
    try:
        model = get_model()
        model_loaded = model is not None
        print(f"[PASS] Model loaded successfully: {type(model).__name__}")
        print(f"       Pipeline steps: {list(model.named_steps.keys())}")
        print(f"       Classes: {getattr(model, 'classes_', 'N/A')}")
    except Exception as e:
        model_loaded = False
        print(f"[FAIL] Model loading failed: {e}")

    # 2. Prediction & Probability Test on Sample Texts
    print("\n--- Test 2: Inference & Probability Tests ---")
    test_cases = [
        (
            "Example 1 (High-energy / isolation)",
            "During maintenance, a worker entered the work area while the equipment isolation was not fully verified."
        ),
        (
            "Example 2 (Low-energy / housekeeping)",
            "During inspection, a minor housekeeping issue was observed and corrected."
        ),
        (
            "Example 3 (Confined space / gas)",
            "Personnel detected toxic gas accumulation while conducting maintenance inside a vessel."
        )
    ]

    prediction_pass = True
    probability_pass = True

    for label, text in test_cases:
        res = predict_sif_potential(text)
        print(f"\nCase: {label}")
        print(f"  Input text: \"{text}\"")
        print(f"  Status: {res['status']}")
        print(f"  Predicted Class: {res['predicted_class']}")
        print(f"  Confidence: {res['confidence']}")
        print(f"  Probabilities: {res['probabilities']}")

        if res["status"] != "SUCCESS" or res["predicted_class"] not in ["SIF-potential", "Non-SIF-potential"]:
            prediction_pass = False
        if res["confidence"] is None or res["probabilities"] is None:
            probability_pass = False

    # 3. Error Handling & Edge Cases Test
    print("\n--- Test 3: Error Handling & Validation Tests ---")
    error_cases = [
        ("None input", None),
        ("Empty string", ""),
        ("Whitespace only", "    \n\t  "),
        ("Non-string integer", 12345),
        ("Non-string list", ["some", "text"]),
    ]

    error_handling_pass = True
    for label, val in error_cases:
        err_res = predict_sif_potential(val)
        print(f"Edge Case: {label} -> Status: {err_res['status']}, Error: {err_res['error']}")
        if err_res["status"] != "INVALID_INPUT" or err_res["error"] is None or err_res["predicted_class"] is not None:
            error_handling_pass = False

    print("\n" + "=" * 60)
    print("UNIT TEST SUMMARY RESULTS")
    print("=" * 60)
    print(f"MODEL LOADED: {'YES' if model_loaded else 'NO'}")
    print(f"PREDICTION TEST: {'PASS' if prediction_pass else 'FAIL'}")
    print(f"PROBABILITY TEST: {'PASS' if probability_pass else 'FAIL'}")
    print(f"ERROR HANDLING TEST: {'PASS' if error_handling_pass else 'FAIL'}")
    print("=" * 60)
