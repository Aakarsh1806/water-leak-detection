import React from "react";
import { FileText, Download, CheckCircle, BarChart2, ShieldCheck } from "lucide-react";

export const ReportsView: React.FC = () => {
  const reports = [
    { id: "REP-001", title: "Benchmark Run Summary (RUN_001 - RUN_012)", date: "May 24, 2025", type: "PDF Report", size: "2.4 MB" },
    { id: "REP-002", title: "Detector ROC Curve & AUC Evaluation Data", date: "May 23, 2025", type: "CSV Dataset", size: "850 KB" },
    { id: "REP-003", title: "Branch Localization Diagnostic Audit", date: "May 22, 2025", type: "PDF Audit", size: "1.2 MB" },
    { id: "REP-004", title: "Motor Current Signature Calibration Log", date: "May 20, 2025", type: "Parquet Dataset", size: "4.1 MB" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>Experiment & Benchmark Reports</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Download research-grade evaluation summaries, benchmark metrics, and exported parquet datasets.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {reports.map((r) => (
            <div key={r.id} className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between hover:bg-slate-100/70 transition">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                  {r.type.includes("PDF") ? "PDF" : "CSV"}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">{r.title}</h4>
                  <p className="text-xs text-slate-400">{r.id} • Generated on {r.date} • {r.size}</p>
                </div>
              </div>
              <button className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 text-xs font-bold rounded-xl shadow-2xs flex items-center space-x-1.5 transition">
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
