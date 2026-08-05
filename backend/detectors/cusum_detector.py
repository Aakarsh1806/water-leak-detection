"""
CUSUM (Cumulative Sum) Residual Detector
Detects small, persistent micro-leaks below 3-Sigma instantaneous thresholds.
"""

class CUSUMDetector:
    def __init__(self, slack_k=0.15, decision_h=3.0):
        self.k = slack_k  # Reference value slack
        self.h = decision_h  # Decision boundary threshold
        self.s_pos = 0.0

    def reset(self):
        self.s_pos = 0.0

    def analyze(self, residual_lpm):
        # Accumulate positive residual deviation above slack k
        self.s_pos = max(0.0, self.s_pos + (residual_lpm - self.k))
        
        is_alarm = self.s_pos >= self.h
        confidence = min(1.0, max(0.0, self.s_pos / (self.h * 1.5))) if is_alarm else round(self.s_pos / self.h, 2)

        return {
            "method": "cusum",
            "cusum_score": round(self.s_pos, 2),
            "threshold_h": self.h,
            "is_alarm": is_alarm,
            "confidence": round(confidence, 2)
        }
