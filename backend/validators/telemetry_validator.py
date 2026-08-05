"""
Telemetry Validator Module
Rejects corrupted packets, negative flow values, and invalid timestamp payloads before database storage.
"""
from backend.models.telemetry import TelemetryDTO
from backend.utils.logger import logger

class TelemetryValidator:
    @staticmethod
    def validate(raw_data: dict) -> tuple[bool, str]:
        if not isinstance(raw_data, dict):
            return False, "Payload must be a valid JSON dictionary"

        if "ts" not in raw_data or "seq" not in raw_data:
            return False, "Missing required top-level key: 'ts' or 'seq'"

        try:
            dto = TelemetryDTO.from_dict(raw_data)
            
            # Check for illegal negative flow rates
            if dto.flow.q_in_lpm < 0 or dto.flow.q_out_lpm < 0 or dto.flow.q_branch_lpm < 0:
                logger.warning(f"Rejected telemetry seq={dto.seq}: negative flow rate detected")
                return False, "Negative flow rate value detected"

            # Check for unreasonable voltage
            if dto.power.voltage < 0.0 or dto.power.voltage > 24.0:
                logger.warning(f"Rejected telemetry seq={dto.seq}: voltage out of range ({dto.power.voltage}V)")
                return False, "Voltage out of valid operational range (0V - 24V)"

            return True, "VALID"
        except Exception as e:
            logger.error(f"Validation error: {e}")
            return False, f"Validation exception: {str(e)}"
