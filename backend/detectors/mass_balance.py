"""Mass Balance Leak Detector

Calculates flow differential residual Delta Q = Q_in - (Q_out + Q_branch)
and evaluates 3-sigma dynamic thresholding.
"""

import numpy as np

class MassBalanceDetector:
    def __init__(self, sigma_threshold=3.0, persistence_count=5):
        self.sigma_threshold = sigma_threshold
        self.persistence_count = persistence_count
        self.history = []
        self.consecutive_triggers = 0

    def process_sample(self, q_in, q_out, q_branch=0.0):
        residual = q_in - (q_out + q_branch)
        self.history.append(residual)
        if len(self.history) > 100:
            self.history.pop(0)

        # np.mean/np.std return numpy.float64; comparing against them yields
        # numpy.bool_, which json/FastAPI can't serialize (silently breaks the
        # API response) — cast everything back to native Python types here.
        mean = float(np.mean(self.history)) if len(self.history) >= 10 else 0.0
        std = float(np.std(self.history)) if len(self.history) >= 10 else 0.05
        threshold = mean + max(self.sigma_threshold * std, 0.20)

        is_anomaly = bool(abs(residual) > threshold)
        if is_anomaly:
            self.consecutive_triggers += 1
        else:
            self.consecutive_triggers = max(0, self.consecutive_triggers - 1)

        is_alarm = bool(self.consecutive_triggers >= self.persistence_count)
        confidence = min(1.0, abs(residual) / (threshold + 0.01)) if is_anomaly else 0.0

        return {
            "method": "Mass_Balance",
            "residual": round(residual, 3),
            "threshold": round(threshold, 3),
            "is_anomaly": is_anomaly,
            "is_alarm": is_alarm,
            "confidence": round(confidence, 2)
        }
