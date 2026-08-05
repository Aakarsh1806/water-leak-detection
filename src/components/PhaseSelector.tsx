import React from "react";
import { Home, Waves, ShieldAlert, FlaskConical, BarChart3, GitBranch, Calendar, Layers, Activity, Sparkles, FolderTree } from "lucide-react";

export type TabType = 
  | "home"
  | "monitor" 
  | "detectors" 
  | "experiments" 
  | "analytics" 
  | "localization" 
  | "workorders" 
  | "wntr" 
  | "health" 
  | "docs" 
  | "code";

interface PhaseSelectorProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const PhaseSelector: React.FC<PhaseSelectorProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; phase: string; icon: any }[] = [
    { id: "home", label: "Home", phase: "Overview", icon: Home },
    { id: "monitor", label: "Live Monitoring", phase: "Phase 1", icon: Waves },
    { id: "detectors", label: "Leak Detection", phase: "Phase 2 & 3", icon: ShieldAlert },
    { id: "experiments", label: "Experiments", phase: "Phase 2", icon: FlaskConical },
    { id: "analytics", label: "Analytics", phase: "Phase 3", icon: BarChart3 },
    { id: "localization", label: "Localization", phase: "Phase 3", icon: GitBranch },
    { id: "workorders", label: "Work Orders", phase: "Phase 4", icon: Calendar },
    { id: "wntr", label: "Simulation", phase: "Phase 4", icon: Layers },
    { id: "health", label: "System Health", phase: "Health", icon: Activity },
    { id: "docs", label: "AI Memory", phase: "Docs", icon: Sparkles },
    { id: "code", label: "Repo Explorer", phase: "Code", icon: FolderTree }
  ];

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-6 py-2 overflow-x-auto flex space-x-1 scrollbar-none">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition flex items-center space-x-2 whitespace-nowrap ${
              isActive
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold shadow-sm"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            }`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
              isActive ? "bg-blue-500/30 text-blue-300" : "bg-slate-800 text-slate-500"
            }`}>
              {tab.phase}
            </span>
          </button>
        );
      })}
    </div>
  );
};
