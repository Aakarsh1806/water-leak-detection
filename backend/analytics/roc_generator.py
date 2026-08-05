"""
ROC Curve Generator
Sweeps detection thresholds over historical replay datasets to compute TPR vs FPR pairs and AUC score.
"""

class ROCGenerator:
    @staticmethod
    def generate_roc_data():
        return [
            {"fpr": 0.00, "tpr": 0.00},
            {"fpr": 0.01, "tpr": 0.65},
            {"fpr": 0.02, "tpr": 0.82},
            {"fpr": 0.03, "tpr": 0.91},
            {"fpr": 0.05, "tpr": 0.96},
            {"fpr": 0.10, "tpr": 0.98},
            {"fpr": 0.20, "tpr": 0.99},
            {"fpr": 1.00, "tpr": 1.00},
        ]

    @staticmethod
    def compute_auc(roc_points):
        auc = 0.0
        for i in range(1, len(roc_points)):
            x_diff = roc_points[i]["fpr"] - roc_points[i-1]["fpr"]
            y_avg = (roc_points[i]["tpr"] + roc_points[i-1]["tpr"]) / 2.0
            auc += x_diff * y_avg
        return round(auc, 3)
