"""
Multi-Method Fusion Engine
Combines multi-detector results into a unified, false-positive resilient detection event.
"""

class FusionEngine:
    def __init__(self, weights=None):
        self.weights = weights or {
            "mass_balance": 0.40,
            "current_signature": 0.25,
            "cusum": 0.20,
            "mnf": 0.15
        }

    def fuse(self, detector_results):
        total_score = 0.0
        active_methods = []

        for res in detector_results:
            method = res.get("method")
            weight = self.weights.get(method, 0.20)
            if res.get("is_alarm"):
                active_methods.append(method)
                total_score += weight * res.get("confidence", 1.0)

        is_alarm = total_score >= 0.35 or len(active_methods) >= 2

        return {
            "fused_score": round(total_score, 2),
            "is_alarm": is_alarm,
            "active_methods": active_methods,
            "detector_count": len(detector_results)
        }
