"""
Current Signature Analysis Detector
Uses Motor Current (INA219) vs Flow Rate to detect hydraulic load shifts during leak initiation.
"""

class CurrentSignatureDetector:
    def __init__(self, baseline_ma=420.0, current_drop_threshold_ma=20.0):
        self.baseline_ma = baseline_ma
        self.threshold_ma = current_drop_threshold_ma

    def predict_expected_current(self, flow_lpm, voltage_v=12.0):
        # f(flow, voltage) baseline model
        return self.baseline_ma + (flow_lpm * 2.5)

    def analyze(self, current_ma, flow_lpm, voltage_v=12.0):
        expected_current = self.predict_expected_current(flow_lpm, voltage_v)
        residual_ma = expected_current - current_ma
        
        is_alarm = residual_ma > self.threshold_ma
        confidence = min(1.0, max(0.0, residual_ma / (self.threshold_ma * 2.0))) if is_alarm else 0.0

        return {
            "method": "current_signature",
            "actual_current_ma": current_ma,
            "current_ma": current_ma,  # alias for dashboard components (DetectionEngineView)
            "expected_current_ma": expected_current,
            "residual_ma": round(residual_ma, 2),
            "current_delta_ma": round(-residual_ma, 2),  # alias: negative = current dropped
            "is_alarm": is_alarm,
            "confidence": round(confidence, 2)
        }
