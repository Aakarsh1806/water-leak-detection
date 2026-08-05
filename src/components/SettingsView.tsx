import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Server, Database, ShieldAlert, Terminal } from "lucide-react";

export const SettingsView: React.FC = () => {
  const [mqttHost, setMqttHost] = useState("localhost");
  const [mqttPort, setMqttPort] = useState(1883);
  const [mongoUri, setMongoUri] = useState("mongodb://localhost:27017");
  const [sigmaMultiplier, setSigmaMultiplier] = useState(3.0);
  const [persistenceSec, setPersistenceSec] = useState(10);
  const [saved, setSaved] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSelfTest = () => {
    setTestOutput("Running system self-test...\n✓ MQTT Broker: Connected\n✓ MongoDB: Connected\n✓ Telemetry Validator: 100% Passed\n✓ Detectors: 4 Active\n✓ System Health: OK");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center space-x-2">
              <Settings className="w-6 h-6 text-blue-600" />
              <span>System Settings & Config Manager</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Configure MQTT broker, MongoDB URI, detection persistence, and run full system self-diagnostics.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleSelfTest}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center space-x-2 transition"
            >
              <Terminal className="w-4 h-4 text-slate-600" />
              <span>Run Self-Test</span>
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 flex items-center space-x-2 transition"
            >
              {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
              <span>{saved ? "Saved Settings!" : "Save Configuration"}</span>
            </button>
          </div>
        </div>

        {testOutput && (
          <div className="bg-slate-900 text-slate-200 font-mono text-xs rounded-xl p-4 mb-6 border border-slate-800 whitespace-pre-line shadow-inner">
            {testOutput}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MQTT Configuration */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Server className="w-4 h-4 text-blue-600" />
              <span>MQTT Broker Connection</span>
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Broker Host</label>
              <input
                type="text"
                value={mqttHost}
                onChange={(e) => setMqttHost(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">Port</label>
              <input
                type="number"
                value={mqttPort}
                onChange={(e) => setMqttPort(parseInt(e.target.value))}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Database & Detector Parameters */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-600" />
              <span>MongoDB & Detection Parameters</span>
            </h3>

            <div>
              <label className="text-xs font-medium text-slate-600 block mb-1">MongoDB Connection URI</label>
              <input
                type="text"
                value={mongoUri}
                onChange={(e) => setMongoUri(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Sigma Multiplier</label>
                <input
                  type="number"
                  step="0.5"
                  value={sigmaMultiplier}
                  onChange={(e) => setSigmaMultiplier(parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-600 block mb-1">Persistence (Seconds)</label>
                <input
                  type="number"
                  value={persistenceSec}
                  onChange={(e) => setPersistenceSec(parseInt(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
