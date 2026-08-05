import React, { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Play, Square, FlaskConical, Tag, CheckCircle2, FileSpreadsheet } from "lucide-react";

export const ExperimentsView: React.FC = () => {
  const [selectedRun, setSelectedRun] = useState("RUN_001");
  const [isLoggingLeak, setIsLoggingLeak] = useState(false);
  const [operatorNotes, setOperatorNotes] = useState("Manual solenoid valve leak test with calibrated 0.50 LPM orifice");
  const [logMessage, setLogMessage] = useState<string | null>(null);

  const runs = [
    { run_id: "RUN_001", operator: "Manoj", date: "2026-08-03", leak_size_lpm: 0.50, location: "Branch_A", pump_mode: "Constant 12V", notes: "Micro-leak sensitivity baseline test" },
    { run_id: "RUN_002", operator: "Member_B", date: "2026-08-03", leak_size_lpm: 1.25, location: "Branch_A", pump_mode: "Constant 12V", notes: "Standard branch A solenoid opening" },
    { run_id: "RUN_003", operator: "Member_C", date: "2026-08-03", leak_size_lpm: 2.50, location: "Main_Trunk", pump_mode: "Variable Load", notes: "High severity main pipeline rupture" },
    { run_id: "RUN_004", operator: "Member_D", date: "2026-08-03", leak_size_lpm: 0.30, location: "Micro_Joint", pump_mode: "Constant 12V", notes: "Minimum detectable flow threshold test" },
    { run_id: "RUN_005", operator: "Manoj", date: "2026-08-03", leak_size_lpm: 1.80, location: "Branch_B", pump_mode: "Constant 12V", notes: "Branch B isolation and side loop test" },
  ];

  const currentMetadata = runs.find((r) => r.run_id === selectedRun) || runs[0];

  // Comparison chart data (Actual vs Estimated Leak Rate over time)
  const comparisonData = Array.from({ length: 60 }, (_, i) => {
    const timeStr = `14:${Math.floor(i / 60).toString().padStart(2, '0')}:${(i % 60).toString().padStart(2, '0')}`;
    const isLeak = i >= 20 && i <= 45;
    const actualLeak = isLeak ? currentMetadata.leak_size_lpm : 0.0;
    const estimatedLeak = isLeak ? Math.max(0, actualLeak + (Math.sin(i) * 0.04) - 0.02) : (i > 45 && i < 48 ? 0.05 : 0.0);

    return {
      time: timeStr,
      ActualLeak: Number(actualLeak.toFixed(2)),
      EstimatedLeak: Number(estimatedLeak.toFixed(2)),
      Residual: Number((actualLeak > 0 ? actualLeak + 0.03 : 0.02).toFixed(2))
    };
  });

  const handleStartLeak = () => {
    setIsLoggingLeak(true);
    setLogMessage(`[Ground Truth] Logged Leak START timestamp in MongoDB (start_ts = ${Math.floor(Date.now()/1000)})`);
    setTimeout(() => setLogMessage(null), 4000);
  };

  const handleStopLeak = () => {
    setIsLoggingLeak(false);
    setLogMessage(`[Ground Truth] Logged Leak STOP timestamp in MongoDB (stop_ts = ${Math.floor(Date.now()/1000)})`);
    setTimeout(() => setLogMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2 tracking-tight">
              <FlaskConical className="w-6 h-6 text-purple-600" />
              <span>Phase 2: Ground Truth Experiments & Benchmark Logging</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Direct digital ground truth timestamp recording to MongoDB (`leak_events` collection). Eliminates manual paper notes.
            </p>
          </div>

          {/* Experiment Selector */}
          <div className="flex items-center space-x-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold px-2">Select Run:</span>
            {runs.map((r) => (
              <button
                key={r.run_id}
                onClick={() => setSelectedRun(r.run_id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition ${
                  selectedRun === r.run_id
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                }`}
              >
                {r.run_id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {logMessage && (
        <div className="bg-purple-50 border border-purple-200 text-purple-800 p-3.5 rounded-2xl text-xs font-mono flex items-center space-x-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
          <span>{logMessage}</span>
        </div>
      )}

      {/* Ground Truth Digital Logger Panel & Metadata */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Metadata Panel */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Tag className="w-4 h-4 text-purple-600" />
            <span>Experiment Run Metadata ({selectedRun})</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 font-medium">Operator:</span>
              <span className="font-bold text-slate-900">{currentMetadata.operator}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 font-medium">Leak Location:</span>
              <span className="font-bold text-purple-600 font-mono">{currentMetadata.location}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 font-medium">Calibrated Leak Size:</span>
              <span className="font-bold text-rose-600 font-mono">{currentMetadata.leak_size_lpm} LPM</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 font-medium">Pump Operating Mode:</span>
              <span className="font-bold text-slate-900">{currentMetadata.pump_mode}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60">
              <div className="text-slate-500 font-medium mb-1">Notes:</div>
              <div className="text-slate-700 italic">{currentMetadata.notes}</div>
            </div>
          </div>
        </div>

        {/* Digital Ground Truth Logger Controls */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <Square className="w-4 h-4 text-rose-600" />
              <span>Digital Ground Truth Logger (MongoDB Integration)</span>
            </span>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono ${
              isLoggingLeak ? "bg-rose-100 text-rose-700 border border-rose-200 animate-pulse" : "bg-slate-100 text-slate-600"
            }`}>
              {isLoggingLeak ? "RECORDING GROUND TRUTH" : "READY"}
            </span>
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            {!isLoggingLeak ? (
              <button
                onClick={handleStartLeak}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md shadow-rose-600/20 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Ground Truth Leak Event</span>
              </button>
            ) : (
              <button
                onClick={handleStopLeak}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center space-x-2 shadow-md shadow-emerald-600/20 transition"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Ground Truth Leak Event</span>
              </button>
            )}

            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={operatorNotes}
                onChange={(e) => setOperatorNotes(e.target.value)}
                placeholder="Operator test notes..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Timeline Visualizer */}
          <div className="pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-500 mb-3">Experiment Timeline Phases</div>
            <div className="grid grid-cols-4 gap-3 text-center text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/70">
                <div className="text-[10px] text-slate-400 font-mono font-medium">00:00 - 00:20</div>
                <div className="font-bold text-slate-700 mt-0.5">Baseline (0 LPM)</div>
              </div>
              <div className="bg-rose-50 p-3 rounded-xl border border-rose-200">
                <div className="text-[10px] text-rose-500 font-mono font-medium">00:20</div>
                <div className="font-bold text-rose-700 mt-0.5">Leak Injected</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                <div className="text-[10px] text-blue-500 font-mono font-medium">00:22.1</div>
                <div className="font-bold text-blue-700 mt-0.5">Detector Alarm</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                <div className="text-[10px] text-emerald-500 font-mono font-medium">00:45</div>
                <div className="font-bold text-emerald-700 mt-0.5">Valve Closed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ground Truth vs Detection Chart */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <FileSpreadsheet className="w-4 h-4 text-purple-600" />
            <span>Ground Truth vs Estimated Leak Rate ({selectedRun})</span>
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">Actual vs Estimated (L/min)</span>
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="time" stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94A3B8" domain={[0, 3.0]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="stepAfter" dataKey="ActualLeak" name="Actual Ground Truth Leak (LPM)" stroke="#E11D48" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="EstimatedLeak" name="Detector Estimated Leak (LPM)" stroke="#9333EA" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
