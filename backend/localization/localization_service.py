"""
Localization Service
Coordinates branch isolation testing and hydraulic zone mapping.
"""

class LocalizationService:
    def __init__(self):
        self.known_zones = ["Main_Trunk", "Branch_A", "Branch_B", "Branch_C"]

    def localize_leak(self, residual_lpm, q_branch_lpm, servo_state_deg=0):
        if residual_lpm < 0.1:
            return {"zone": "NONE", "confidence": "NONE"}

        if q_branch_lpm > 0.3 or servo_state_deg == 45:
            return {"zone": "Branch_A", "confidence": "HIGH"}
        elif servo_state_deg == 90:
            return {"zone": "Branch_B", "confidence": "HIGH"}
        else:
            return {"zone": "Main_Trunk", "confidence": "MEDIUM"}
