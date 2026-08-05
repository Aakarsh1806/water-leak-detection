"""
Branch Isolation Analyzer
Evaluates differential residual change before and after isolation valve/servo actuation.
"""

class BranchAnalyzer:
    @staticmethod
    def evaluate_isolation(residual_before, residual_after, isolated_branch):
        drop = residual_before - residual_after
        is_isolated = drop >= (residual_before * 0.70)

        return {
            "isolated_branch": isolated_branch,
            "residual_before": round(residual_before, 2),
            "residual_after": round(residual_after, 2),
            "residual_drop_lpm": round(drop, 2),
            "leak_in_branch": is_isolated,
            "verdict": "CONFIRMED_LEAK_IN_BRANCH" if is_isolated else "LEAK_OUTSIDE_BRANCH"
        }
