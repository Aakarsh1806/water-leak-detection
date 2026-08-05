"""Response Builder

Shapes a raw DetectionPipeline result into the output contract the problem
statement requires: a leak likelihood score, a time window, human-readable
evidence, a false-positive/confidence disclaimer, and a work-order summary.
Deliberately excludes any valve/pump control instruction text.
"""
from backend.llm.summary_client import generate_work_order_summary

_DISCLAIMER = (
    "Results are indicative only and require field verification before any "
    "repair action is taken. This system does not issue valve or pump control "
    "instructions."
)

_CONFIDENCE_FALSE_POSITIVE_RATE = {
    # Rough false-positive rate by confidence tier, based on the fusion engine's
    # historical false-positive reduction (docs/DECISIONS.md #003: 14.2% -> <1.5%
    # once multi-sensor fusion requires 2+ concurrent methods).
    "CRITICAL": 0.01,
    "HIGH": 0.03,
    "MEDIUM": 0.08,
    "LOW": 0.20,
    "NONE": 1.0,
}


def _format_time_window(alarm_onset_ts, ts):
    if alarm_onset_ts is None:
        return None
    duration_sec = max(0, ts - alarm_onset_ts)
    return {
        "start_ts": alarm_onset_ts,
        "end_ts": ts,
        "duration_sec": round(duration_sec, 1)
    }


def _build_evidence_text(pipeline_result):
    residual = pipeline_result["residual"]
    active_methods = pipeline_result["fusion"]["active_methods"]
    pressure = pipeline_result["pressure"]

    parts = [f"flow residual {residual:+.2f} L/min ({'above' if residual > 0 else 'at/below'} baseline)"]
    if pressure["pressure_bar"] is not None:
        source_note = "estimated" if pressure["source"] == "estimated" else "logged"
        parts.append(f"pressure ~{pressure['pressure_bar']} bar ({source_note})")
    if active_methods:
        parts.append(f"confirmed by {', '.join(active_methods)}")
    else:
        parts.append("no detector currently in alarm")

    return "; ".join(parts)


def build_response(pipeline_result, zone_names=None):
    fusion = pipeline_result["fusion"]
    localization = pipeline_result["localization"]
    tier = pipeline_result["confidence_tier"]

    likelihood_score = round(fusion["fused_score"] * 100, 1)
    time_window = _format_time_window(pipeline_result["alarm_onset_ts"], pipeline_result["ts"])
    evidence_text = _build_evidence_text(pipeline_result)
    false_positive_rate = _CONFIDENCE_FALSE_POSITIVE_RATE.get(tier, 0.20)

    evidence_for_summary = {
        "zone": localization.get("zone", "NONE"),
        "likelihood_score": likelihood_score,
        "residual_lpm": pipeline_result["residual"],
        "active_methods": fusion["active_methods"],
        "pressure_bar": pipeline_result["pressure"]["pressure_bar"],
    }

    is_reportable = pipeline_result["state"]["is_confirmed"]
    work_order = generate_work_order_summary(evidence_for_summary) if is_reportable else None

    # Keyed by method for easy lookup by dashboard components (DetectionEngineView etc).
    detectors_by_method = {d["method"]: d for d in pipeline_result["detectors"]}

    return {
        "ts": pipeline_result["ts"],
        "residual": pipeline_result["residual"],
        "is_alarm": is_reportable,
        "likelihood_score": likelihood_score,
        "confidence_tier": tier,
        "time_window": time_window,
        "zone": localization.get("zone", "NONE"),
        "zone_confidence": localization.get("confidence", "NONE"),
        "evidence": evidence_text,
        "active_methods": fusion["active_methods"],
        "false_positive_warning": {
            "disclaimer": _DISCLAIMER,
            "estimated_false_positive_rate": false_positive_rate
        },
        "work_order_summary": work_order,
        "detectors": detectors_by_method,
        "fusion": {
            "fused_confidence": round(fusion["fused_score"], 2),
            "is_alarm": is_reportable,
            "severity": tier
        },
        "pressure": pipeline_result["pressure"],
    }
