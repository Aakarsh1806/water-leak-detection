"""
Confidence Engine
Categorizes fused multi-signal detection into explainable qualitative levels: LOW, MEDIUM, HIGH, CRITICAL.
"""

class ConfidenceEngine:
    @staticmethod
    def evaluate(fused_score, active_methods_count, persistence_sec=0):
        if fused_score >= 0.75 or (active_methods_count >= 3 and persistence_sec >= 10):
            return "CRITICAL"
        elif fused_score >= 0.50 or active_methods_count >= 2:
            return "HIGH"
        elif fused_score >= 0.35:
            return "MEDIUM"
        elif fused_score > 0.0:
            return "LOW"
        return "NONE"
