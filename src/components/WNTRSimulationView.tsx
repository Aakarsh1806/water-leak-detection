import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Layers } from "lucide-react";

export const WNTRSimulationView: React.FC = () => {
  const [simData, setSimData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/simulation/wntr")
      .then((res) => res.json())
      .then((data) => setSimData(data))
      .catch((err) => console.error(err));
  }, []);

  const chartData = simData
    ? simData.hours.map((h: string, idx: number) => ({
        hour: h,
        NormalPressure: simData.normal_pressure_m[idx],
        LeakPressure: simData.leak_pressure_m[idx]
      }))
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2 tracking-tight">
          <Layers className="w-6 h-6 text-cyan-600" />
          <span>Phase 4: WNTR / EPANET Network Hydraulic Simulation & Benchmark Suite</span>
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Pressure head and emitter leakage simulation across EPANET Net3 pipe network model over a 24-hour diurnal cycle.
        </p>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
          <span>24-Hour Diurnal Junction Pressure Head Comparison</span>
          <span className="text-xs text-slate-400 font-mono font-medium">Net3 Model</span>
        </h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
              <XAxis dataKey="hour" stroke="#94A3B8" tick={{ fontSize: 11 }} />
              <YAxis stroke="#94A3B8" domain={[20, 40]} tick={{ fontSize: 11 }} label={{ value: 'Head (m)', angle: -90, position: 'insideLeft', fill: '#94A3B8', fontSize: 11 }} />
              <Tooltip contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line type="monotone" dataKey="NormalPressure" name="Nominal Baseline Pressure (m)" stroke="#2563EB" strokeWidth={2.5} dot={false} />
              <Line type="monotone" dataKey="LeakPressure" name="Pressure Under Leak Injection (m)" stroke="#E11D48" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
