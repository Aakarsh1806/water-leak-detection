import unittest
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "backend"))
from detectors.mass_balance import MassBalanceDetector

class TestMassBalance(unittest.TestCase):
    def test_clean_flow(self):
        detector = MassBalanceDetector()
        res = detector.process_sample(q_in=5.0, q_out=5.0, q_branch=0.0)
        self.assertFalse(res["is_alarm"])
        self.assertAlmostEqual(res["residual"], 0.0, places=2)

    def test_leak_flow(self):
        detector = MassBalanceDetector(persistence_count=2)
        detector.process_sample(q_in=5.0, q_out=3.5, q_branch=0.0)
        res = detector.process_sample(q_in=5.0, q_out=3.5, q_branch=0.0)
        self.assertTrue(res["is_alarm"])
        self.assertAlmostEqual(res["residual"], 1.5, places=2)

if __name__ == "__main__":
    unittest.main()
