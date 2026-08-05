import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, Activity, Layers, ArrowRight, Clock } from "lucide-react";

interface HomeViewProps {
  latestTelemetry: any;
  onNavigateTab: (tab: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ latestTelemetry, onNavigateTab }) => {
  const isLeak = latestTelemetry?.leak_active ?? false;
  const isPumpOn = latestTelemetry?.pump_on ?? true;

  // Status computation
  const statusColor = isLeak ? "RED" : (isPumpOn ? "GREEN" : "YELLOW");

  const recentActivities = [
    { time: "Just now", event: "1Hz Telemetry Ingest (Q_in = 5.20 LPM, Q_out = 5.18 LPM)", status: "NOMINAL", type: "success" },
    { time: "2 mins ago", event: "Ground Truth Experiment RUN_002 Completed (Branch_A 1.25 LPM)", status: "COMPLETED", type: "info" },
    { time: "5 mins ago", event: "MongoDB Collection Indexes Verified (`telemetry.ts`)", status: "OK", type: "success" },
    { time: "12 mins ago", event: "CP-SAT Crew Dispatch Scheduled for Work Order WO-2026-001", status: "DISPATCHED", type: "warning" },
    { time: "25 mins ago", event: "WNTR 24-hr EPANET Pressure Simulation Executed", status: "PASSED", type: "info" },
  ];

  return (
    <div className="space-y-6">
      {/* Top Row Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Current Status Card */}
        <div className={`border rounded-xl p-5 shadow-sm transition ${
          statusColor === "RED" 
            ? "bg-rose-950/30 border-rose-500/50" 
            : statusColor === "YELLOW"
            ? "bg-amber-950/30 border-amber-500/50"
            : "bg-emerald-950/20 border-emerald-500/40"
        }`}>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Rig Status</div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              {statusColor === "GREEN" && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              {statusColor === "YELLOW" && <AlertTriangle className="w-6 h-6 text-amber-400" />}
              {statusColor === "RED" && <AlertOctagon className="w-6 h-6 text-rose-500 animate-pulse" />}
              <span className={`text-2xl font-black ${
                statusColor === "GREEN" ? "text-emerald-400" : statusColor === "YELLOW" ? "text-amber-400" : "text-rose-400"
              }`}>
                {statusColor}
              </span>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-mono font-medium">
              {isLeak ? "LEAK ACTIVE" : (isPumpOn ? "PUMP RUNNING" : "PUMP IDLE")}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-2">
            {isLeak ? "Solenoid Leak Valve OPEN (Branch A)" : "Normal recirculating closed-loop flow"}
          </div>
        </div>

        {/* Total Experiments Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Experiments</div>
          <div className="text-3xl font-extrabold text-blue-400 mt-2">12 <span className="text-sm font-normal text-slate-400">Runs</span></div>
          <div className="text-xs text-slate-500 mt-1">RUN_001 to RUN_012 Benchmarks</div>
        </div>

        {/* Leaks Detected Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Leaks Detected</div>
          <div className="text-3xl font-extrabold text-cyan-400 mt-2">11 <span className="text-sm font-normal text-slate-400">Confirmed</span></div>
          <div className="text-xs text-slate-500 mt-1">Ground truth verified matching</div>
        </div>

        {/* Precision Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Detection Precision</div>
          <div className="text-3xl font-extrabold text-emerald-400 mt-2">96.4%</div>
          <div className="text-xs text-slate-500 mt-1">Median Latency: 2.1s</div>
        </div>
      </div>

      {/* Middle: System Architecture Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <span>End-to-End Rig & Digital Twin Architecture</span>
          </h3>
          <span className="text-xs text-slate-500 font-mono">1Hz Streaming Data Pipeline</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-center py-4">
          {/* Step 1: ESP32 */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4 text-center hover:border-blue-500/50 transition">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">1. Hardware Rig</div>
            <div className="text-sm font-bold text-slate-100">ESP32 DevKit</div>
            <p className="text-[11px] text-slate-400 mt-1">3× YF-S201 Flow + INA219 Current Sensor</p>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 2: MQTT */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4 text-center hover:border-blue-500/50 transition">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">2. Transport</div>
            <div className="text-sm font-bold text-slate-100">MQTT Broker</div>
            <p className="text-[11px] text-slate-400 mt-1">Mosquitto (`rig/telemetry` topic @ 1Hz)</p>
          </div>

          <div className="hidden md:flex justify-center text-slate-600">
            <ArrowRight className="w-5 h-5" />
          </div>

          {/* Step 3: Backend */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-4 text-center hover:border-blue-500/50 transition">
            <div className="text-xs text-blue-400 font-bold uppercase tracking-wider mb-1">3. Backend Engine</div>
            <div className="text-sm font-bold text-slate-100">Python / MongoDB</div>
            <p className="text-[11px] text-slate-400 mt-1">Mass Balance, CUSUM, MNF & MongoDB Store</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <button 
            onClick={() => onNavigateTab("monitor")}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-left transition group"
          >
            <div className="text-xs font-semibold text-blue-400 group-hover:text-blue-300">📡 Live Monitoring →</div>
            <div className="text-xs text-slate-400 mt-0.5">Inspect 1Hz flow curves & motor current</div>
          </button>
          <button 
            onClick={() => onNavigateTab("experiments")}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-left transition group"
          >
            <div className="text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">🧪 Ground Truth Experiments →</div>
            <div className="text-xs text-slate-400 mt-0.5">Log leak start/end timestamps & benchmark runs</div>
          </button>
          <button 
            onClick={() => onNavigateTab("analytics")}
            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 text-left transition group"
          >
            <div className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">📊 Precision Analytics →</div>
            <div className="text-xs text-slate-400 mt-0.5">ROC curves, F1 scores, & method benchmarks</div>
          </button>
        </div>
      </div>

      {/* Bottom: Recent Activity Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center space-x-2">
          <Clock className="w-4 h-4 text-slate-400" />
          <span>Recent Activity Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-700">
              <tr>
                <th className="p-3">Time</th>
                <th className="p-3">Event Description</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {recentActivities.map((act, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40 transition">
                  <td className="p-3 font-mono text-slate-400 whitespace-nowrap">{act.time}</td>
                  <td className="p-3 font-medium">{act.event}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      act.type === "success" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                      act.type === "warning" ? "bg-amber-500/20 text-amber-300 border border-amber-500/30" :
                      "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}>
                      {act.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
