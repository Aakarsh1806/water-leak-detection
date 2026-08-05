"""
Pump Motor Model
Calibrates motor current vs flow rate curve during baseline 12V operation.
"""

class PumpModel:
    def __init__(self, baseline_no_load_ma=380.0, load_slope=8.5):
        self.no_load_ma = baseline_no_load_ma
        self.slope = load_slope

    def predict_current(self, flow_lpm):
        return self.no_load_ma + (flow_lpm * self.slope)

    def compute_residual(self, actual_ma, flow_lpm):
        expected = self.predict_current(flow_lpm)
        return expected - actual_ma
