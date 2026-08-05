import React, { useState, useEffect } from "react";
import { FileText, Save, Check, Code, Eye, RefreshCw, Sparkles } from "lucide-react";

export const DocContextHubView: React.FC = () => {
  const [docList, setDocList] = useState<string[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<string>("PROJECT_CONTEXT.md");
  const [content, setContent] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/docs")
      .then((res) => res.json())
      .then((files) => {
        if (Array.isArray(files)) {
          setDocList(files);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedDoc) {
      fetch(`/api/docs/${selectedDoc}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.content) {
            setContent(data.content);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [selectedDoc]);

  const handleSave = () => {
    fetch(`/api/docs/${selectedDoc}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSavedSuccess(true);
          setTimeout(() => setSavedSuccess(false), 2000);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>AI Memory & Documentation Architecture Hub</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Live documentation hub. Any edits made here persist directly to <code className="text-amber-300">docs/*.md</code> for team & AI agent context.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setEditMode(!editMode)}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 px-3 py-1.5 rounded-lg text-xs transition flex items-center space-x-1.5"
            >
              {editMode ? <Eye className="w-3.5 h-3.5" /> : <Code className="w-3.5 h-3.5" />}
              <span>{editMode ? "Preview Mode" : "Edit Raw Markdown"}</span>
            </button>

            <button
              onClick={handleSave}
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-4 py-1.5 rounded-lg text-xs transition shadow flex items-center space-x-1.5"
            >
              {savedSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              <span>{savedSuccess ? "Saved!" : "Save Changes"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Doc File Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 mb-2">Documentation Specs</h3>
          <div className="space-y-1">
            {docList.map((doc) => (
              <button
                key={doc}
                onClick={() => setSelectedDoc(doc)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs transition font-mono flex items-center space-x-2 ${
                  selectedDoc === doc
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold"
                    : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{doc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Markdown Content Viewer / Editor */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
            <span className="text-sm font-bold text-slate-200 font-mono">docs/{selectedDoc}</span>
            <span className="text-xs text-amber-400/80 font-medium">AI AGENT MEMORY SYNCED</span>
          </div>

          {editMode ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[500px] bg-slate-950 border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 focus:outline-none focus:border-amber-500/50 leading-relaxed"
            />
          ) : (
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-6 min-h-[500px] max-h-[600px] overflow-y-auto text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
