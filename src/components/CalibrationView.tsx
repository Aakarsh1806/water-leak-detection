import React, { useState } from "react";
import { Sliders, Save, RefreshCw, CheckCircle2, ShieldAlert } from "lucide-react";

export const CalibrationView: React.FC = () => {
  const [k1, setK1] = useState(445.2);
  const [k2, setK2] = useState(451.8);
  const [k3, setK3] = useState(447.1);
  const [bias, setBias] = useState(0.02);
  const [sigma, setSigma] = useState(0.03);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Sliders className="w-6 h-6 text-blue-600" />
              <span>Sensor & Hardware Rig Calibration</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Calibrate YF-S201 pulse factors (K-factor), zero-leak baseline bias, and INA219 load models.
            </p>
          </div>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center space-x-2 transition"
          >
            {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
            <span>{saved ? "Saved to Memory!" : "Save Calibration"}</span>
          </button>
        </div>

        {/* Pulse Factors Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-700">Flow 1 Meter (Qin - Inlet)</div>
            <div className="text-[11px] text-slate-400">YF-S201 Interrupt GPIO 18</div>
            <div>
              <label className="text-xs text-slate-500 block mb-1 font-medium">Pulses / Liter Factor (K1)</label>
              <input
                type="number"
                step="0.1"
                value={k1}
                onChange={(e) => setK1(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-700">Flow 2 Meter (Qout - Outlet)</div>
            <div className="text-[11px] text-slate-400">YF-S201 Interrupt GPIO 19</div>
            <div>
              <label className="text-xs text-slate-500 block mb-1 font-medium">Pulses / Liter Factor (K2)</label>
              <input
                type="number"
                step="0.1"
                value={k2}
                onChange={(e) => setK2(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-700">Flow 3 Meter (Qbranch - Side)</div>
            <div className="text-[11px] text-slate-400">YF-S201 Interrupt GPIO 21</div>
            <div>
              <label className="text-xs text-slate-500 block mb-1 font-medium">Pulses / Liter Factor (K3)</label>
              <input
                type="number"
                step="0.1"
                value={k3}
                onChange={(e) => setK3(parseFloat(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Bias & Noise Bounds */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-700">Zero-Leak Flow Bias (LPM)</div>
            <p className="text-[11px] text-slate-500">Systemic offset between inlet and outlet meters during closed loop recirculation.</p>
            <input
              type="number"
              step="0.01"
              value={bias}
              onChange={(e) => setBias(parseFloat(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-3">
            <div className="text-xs font-bold text-slate-700">Baseline Residual Sigma (Noise Std Dev)</div>
            <p className="text-[11px] text-slate-500">Standard deviation of residual noise under normal 12V pump operation.</p>
            <input
              type="number"
              step="0.01"
              value={sigma}
              onChange={(e) => setSigma(parseFloat(e.target.value))}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
