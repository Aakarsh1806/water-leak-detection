import React, { useState } from "react";
import { Bell, AlertTriangle, CheckCircle, Info, Filter, ShieldAlert } from "lucide-react";

export const AlertsView: React.FC = () => {
  const [filter, setFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM">("ALL");

  const alerts = [
    { id: 1, title: "Leak detected with high confidence (Branch A)", severity: "CRITICAL", confidence: "92.4%", timestamp: "May 24, 2025 10:24:10 AM", status: "ACTIVE" },
    { id: 2, title: "Residual above 3-Sigma threshold (1.37 LPM)", severity: "HIGH", confidence: "85.7%", timestamp: "May 24, 2025 10:22:45 AM", status: "ACKNOWLEDGED" },
    { id: 3, title: "Motor current load drop detected (-35.0 mA)", severity: "HIGH", confidence: "81.0%", timestamp: "May 24, 2025 10:20:12 AM", status: "ACKNOWLEDGED" },
    { id: 4, title: "CUSUM accumulation score breached decision boundary h=3.0", severity: "MEDIUM", confidence: "78.3%", timestamp: "May 24, 2025 10:15:30 AM", status: "RESOLVED" },
    { id: 5, title: "Benchmark Experiment EXP-2025-05-24-001 started", severity: "INFO", confidence: "100%", timestamp: "May 24, 2025 08:15:00 AM", status: "RESOLVED" },
  ];

  const filteredAlerts = filter === "ALL" ? alerts : alerts.filter((a) => a.severity === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Bell className="w-6 h-6 text-blue-600" />
              <span>System Alerts & Notifications</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time multi-detector anomaly alerts, confidence evaluation, and historical event log.
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            {(["ALL", "CRITICAL", "HIGH", "MEDIUM"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  filter === f ? "bg-white text-slate-900 shadow-2xs font-bold" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredAlerts.map((a) => (
            <div key={a.id} className="bg-slate-50 border border-slate-200/70 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-start space-x-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  a.severity === "CRITICAL" ? "bg-rose-100 text-rose-600" :
                  a.severity === "HIGH" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                }`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-slate-800">{a.title}</h4>
                    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                      a.severity === "CRITICAL" ? "bg-rose-600 text-white" :
                      a.severity === "HIGH" ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
                    }`}>
                      {a.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{a.timestamp} • Confidence: {a.confidence}</p>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                a.status === "ACTIVE" ? "bg-rose-100 text-rose-700 border border-rose-200" :
                a.status === "ACKNOWLEDGED" ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-slate-200 text-slate-700"
              }`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
