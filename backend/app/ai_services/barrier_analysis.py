"""
Deterministic Barrier Diagnostics Module
----------------------------------------
Evaluates whether physical or administrative safety barriers were present,
missing, failed, bypassed, or compromised based strictly on factual evidence.

States:
- BARRIER_MISSING: Barrier omitted, absent, or not deployed
- BARRIER_FAILED: Barrier physically ruptured, snapped, broke, or malfunctioned
- BARRIER_BYPASSED: Interlock, guard, or safety switch deliberately overridden
- BARRIER_COMPROMISED: Barrier degraded, incomplete, loose, or partially damaged
- BARRIER_PRESENT: Secondary defense or barrier successfully activated
- BARRIER_INSUFFICIENT_INFO: No barrier evidence provided (default; never infer failure from hazard alone)
"""

import re
from typing import Dict

def analyze_barriers(text: str) -> Dict[str, str]:
    """
    Analyzes safety controls and barriers mentioned in the report.
    Strictly deterministic. Never infers 'barrier failed' merely because a hazard exists
    (e.g., 'At front door it is very slippery' -> BARRIER_INSUFFICIENT_INFO).
    """
    if not text or not isinstance(text, str):
        return {
            "status": "BARRIER_INSUFFICIENT_INFO",
            "description": "Insufficient information available to evaluate barrier condition."
        }

    lower_text = text.lower()

    # 1. Bypassed Barriers (Deliberate override or defeat of safety controls)
    if re.search(r'\b(bypass\w*|overrid\w*|bridg\w*|defeat\w*|interlock\s+bypassed|safety\s+switch\s+defeated|tamper\w*)\b', lower_text):
        return {
            "status": "BARRIER_BYPASSED",
            "description": "An engineered safety barrier, interlock, or safety switch was deliberately bypassed or overridden."
        }

    # 2. Missing Barriers (Omission, lack of required control)
    if re.search(r'\b(without[\s_]harness|without[\s_]helmet|without[\s_]ppe|without[\s_]permit|no[\s_]permit|without[\s_]isolation|not[\s_]locked[\s_]out|guard[\s_]missing|no guard|missing guard|unbarricaded|no barricade|no lifeline|no toe[- ]board|no gas test)\b', lower_text):
        return {
            "status": "BARRIER_MISSING",
            "description": "A required safety barrier, personal protective control, or procedural authorization was omitted or not deployed."
        }

    # 3. Failed Barriers (Physical failure, structural breakdown, rupture, snapping)
    # Must have explicit failure verb applied to equipment/barrier
    if re.search(r'\b(barrier failed|snapped|parted|ruptured|burst|cable broke|hose detached|gasket blowout|brake failure|grating collapsed|weld gave way|shackle sheared)\b', lower_text):
        return {
            "status": "BARRIER_FAILED",
            "description": "A primary physical safety barrier or containment mechanism suffered sudden mechanical rupture or operational failure."
        }

    # 4. Compromised Barriers (Degraded, corroded, loose, partial deficiency)
    if re.search(r'\b(corroded|frayed|loose bolt|cracked weld|smudged tag|unpinned|partially open|damaged netting|overdue bump test|faded pictogram)\b', lower_text):
        return {
            "status": "BARRIER_COMPROMISED",
            "description": "Safety barrier integrity was compromised, degraded, or in need of restorative maintenance."
        }

    # 5. Present / Functioning Barriers (Arrested, stopped, prevented)
    if re.search(r'\b(safety net caught|harness arrested|interlock stopped|emergency stop activated|tripped breaker|prevented injury|alarm sounded|gas detector alerted|stopped the job|hazard contained)\b', lower_text):
        return {
            "status": "BARRIER_PRESENT",
            "description": "An operational safety barrier or emergency defense successfully functioned as intended."
        }

    # 6. Default: Insufficient Information
    # CRITICAL: A simple hazard description (e.g. 'At front door it is very slippery')
    # must NOT produce 'barrier failed'.
    return {
        "status": "BARRIER_INSUFFICIENT_INFO",
        "description": "No explicit barrier or control status was identified in the report information."
    }
