import React, { useState, useEffect } from "react";
import { Folder, FileCode, ChevronRight, ChevronDown, Code2 } from "lucide-react";
import { FileNode } from "../types";

export const RepositoryCodeViewer: React.FC = () => {
  const [tree, setTree] = useState<FileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>("firmware/src/main.cpp");
  const [fileContent, setFileContent] = useState<string>("");
  const [expandedDirs, setExpandedDirs] = useState<Record<string, boolean>>({
    "firmware": true,
    "firmware/src": true,
    "backend": true,
    "backend/detectors": true,
    "docs": true
  });

  useEffect(() => {
    fetch("/api/files/tree")
      .then((res) => res.json())
      .then((data) => setTree(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedFile) {
      fetch(`/api/files/content?path=${encodeURIComponent(selectedFile)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.content) {
            setFileContent(data.content);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedFile]);

  const toggleDir = (path: string) => {
    setExpandedDirs((prev) => ({ ...prev, [path]: !prev[path] }));
  };

  const renderTree = (nodes: FileNode[]) => {
    return (
      <ul className="space-y-1 pl-2 text-xs font-mono">
        {nodes.map((node) => {
          if (node.type === "directory") {
            const isExpanded = !!expandedDirs[node.path];
            return (
              <li key={node.path}>
                <div
                  onClick={() => toggleDir(node.path)}
                  className="flex items-center space-x-1.5 py-1 px-2 rounded hover:bg-slate-800 text-slate-300 cursor-pointer select-none"
                >
                  {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                  <Folder className="w-3.5 h-3.5 text-blue-400" />
                  <span className="font-semibold">{node.name}/</span>
                </div>
                {isExpanded && node.children && renderTree(node.children)}
              </li>
            );
          } else {
            return (
              <li key={node.path}>
                <div
                  onClick={() => setSelectedFile(node.path)}
                  className={`flex items-center space-x-1.5 py-1 px-2 rounded cursor-pointer select-none transition ${
                    selectedFile === node.path
                      ? "bg-blue-600/20 text-blue-300 font-bold border-l-2 border-blue-500"
                      : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5 text-slate-500" />
                  <span>{node.name}</span>
                </div>
              </li>
            );
          }
        })}
      </ul>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Code2 className="w-5 h-5 text-blue-400" />
          <span>Repository Architecture & Codebase File Explorer</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Browse firmware C++ sources (`firmware/src`), Python detection backend modules (`backend/detectors`), simulation scripts, and tests.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Directory Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm max-h-[600px] overflow-y-auto">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-3">Project Directory</h3>
          {renderTree(tree)}
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-xs font-mono font-bold text-blue-400">{selectedFile}</span>
            <span className="text-[10px] text-slate-500 font-mono">READ-ONLY EXPLORER</span>
          </div>

          <pre className="bg-slate-950 border border-slate-800 rounded-lg p-5 min-h-[500px] max-h-[600px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
            {fileContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
