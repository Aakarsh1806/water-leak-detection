import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { BarChart3, Target, Award, Zap, Clock } from "lucide-react";

export const AnalyticsView: React.FC = () => {
  // ROC Curve Data
  const rocData = [
    { fpr: 0.00, tpr: 0.00 },
    { fpr: 0.01, tpr: 0.65 },
    { fpr: 0.02, tpr: 0.82 },
    { fpr: 0.03, tpr: 0.91 },
    { fpr: 0.05, tpr: 0.96 },
    { fpr: 0.10, tpr: 0.98 },
    { fpr: 0.20, tpr: 0.99 },
    { fpr: 1.00, tpr: 1.00 },
  ];

  // Recall vs Leak Size Chart Data
  const recallVsLeakData = [
    { size: "0.2 LPM", recall: 78.5, precision: 84.0 },
    { size: "0.5 LPM", recall: 91.2, precision: 95.5 },
    { size: "1.0 LPM", recall: 98.0, precision: 98.2 },
    { size: "1.5 LPM", recall: 99.5, precision: 99.0 },
    { size: "2.5 LPM", recall: 100.0, precision: 100.0 },
  ];

  // Method Comparison Data
  const methodComparison = [
    { method: "Mass Balance Residual (3-Sigma)", precision: "96.4%", recall: "92.1%", latency: "2.1s", false_positives: "2" },
    { method: "Motor Current Signature Analysis", precision: "88.2%", recall: "85.0%", latency: "1.2s", false_positives: "6" },
    { method: "Minimum Night Flow (MNF) Baseline", precision: "90.5%", recall: "88.4%", latency: "5.0s", false_positives: "4" },
    { method: "CUSUM Residual Cumulative Sum", precision: "94.8%", recall: "95.2%", latency: "3.8s", false_positives: "3" },
    { method: "Multi-Sensor Fusion (Weighted Ensemble)", precision: "98.1%", recall: "97.5%", latency: "1.8s", false_positives: "1" },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2 tracking-tight">
          <BarChart3 className="w-6 h-6 text-emerald-600" />
          <span>Phase 3: Rig Benchmark Evaluation & Analytics Engine</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Quantitative ROC curves, F1 score metrics, false positive analysis, and leak sensitivity evaluation across 12 benchmark runs.
        </p>
      </div>

      {/* Top Cards: Precision, Recall, F1 Score, Median Latency */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Precision</span>
            <Target className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-600 mt-2">96.4%</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">TP / (TP + FP)</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Recall</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-extrabold text-blue-600 mt-2">92.1%</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">TP / (TP + FN)</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>F1 Score</span>
            <Zap className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-3xl font-extrabold text-cyan-600 mt-2">0.942</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">Harmonic mean of P & R</div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
            <span>Median Latency</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 mt-2">2.1s</div>
          <div className="text-[11px] font-medium text-slate-400 mt-1">Time to alarm onset</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROC Curve */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>ROC Curve (Receiver Operating Characteristic)</span>
            <span className="text-xs text-emerald-600 font-mono font-bold">AUC = 0.982</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={rocData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="fpr" name="False Positive Rate" stroke="#94A3B8" tick={{ fontSize: 11 }} domain={[0, 1]} />
                <YAxis dataKey="tpr" name="True Positive Rate" stroke="#94A3B8" tick={{ fontSize: 11 }} domain={[0, 1]} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                <Line type="monotone" dataKey="tpr" name="True Positive Rate" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recall vs Leak Size Chart */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
            <span>Detection Recall vs Leak Severity Size</span>
            <span className="text-xs text-blue-600 font-mono font-bold">Sensitivity Curve</span>
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recallVsLeakData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="size" stroke="#94A3B8" tick={{ fontSize: 11 }} />
                <YAxis stroke="#94A3B8" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="recall" name="Recall (%)" fill="#2563EB" radius={[6, 6, 0, 0]} />
                <Bar dataKey="precision" name="Precision (%)" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Method Comparison Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4">Multi-Algorithm Method Comparison Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="p-3.5">Algorithm Method</th>
                <th className="p-3.5">Precision</th>
                <th className="p-3.5">Recall</th>
                <th className="p-3.5">Median Latency</th>
                <th className="p-3.5">False Positives (100h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {methodComparison.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-sans font-bold text-slate-900">{row.method}</td>
                  <td className="p-3.5 font-bold text-emerald-600">{row.precision}</td>
                  <td className="p-3.5 font-bold text-blue-600">{row.recall}</td>
                  <td className="p-3.5 font-bold text-amber-600">{row.latency}</td>
                  <td className="p-3.5 text-slate-500 font-medium">{row.false_positives}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
