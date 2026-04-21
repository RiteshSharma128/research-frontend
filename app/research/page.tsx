"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, X, Brain, Zap,
  Link, ArrowRight, BookOpen, Calendar, Mic
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import AgentProgress from "@/components/AgentProgress";
import ReportView from "@/components/ReportView";
import SourceCard from "@/components/SourceCard";
import ResearchTemplates from "@/components/ResearchTemplates";
import VoiceInput from "@/components/VoiceInput";
import ScheduleResearch from "@/components/ScheduleResearch";

export default function ResearchPage() {
  const { token } = useAuth();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [urls, setUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [researching, setResearching] = useState(false);
  const [agentStates, setAgentStates] = useState<Record<string, any>>({});
  const [currentChunk, setCurrentChunk] = useState("");
  const [streamingReport, setStreamingReport] = useState("");
  const [finalResearch, setFinalResearch] = useState<any>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"progress" | "report" | "sources">("progress");

  // ✅ New states
  const [showTemplates, setShowTemplates] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedLang, setSelectedLang] = useState("english");

  const addUrl = () => {
    if (!urlInput.trim()) return;
    setUrls([...urls, urlInput.trim()]);
    setUrlInput("");
  };

  const startResearch = async () => {
    if (!query.trim()) { toast.error("Research topic likho!"); return; }
    if (!token) { router.push("/auth/login"); return; }

    setResearching(true);
    setAgentStates({});
    setStreamingReport("");
    setFinalResearch(null);
    setSources([]);
    setActiveTab("progress");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/research/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query, urls }),
        }
      );

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "start") {
              toast("🔍 Research starting...");
            }

            if (data.type === "agent") {
              setAgentStates(prev => ({
                ...prev,
                [data.agent]: { status: data.status, message: data.message || "" }
              }));

              if (data.chunk) {
                setCurrentChunk(prev => prev + data.chunk);
                if (data.agent === "writer") {
                  setStreamingReport(prev => prev + data.chunk);
                  setActiveTab("report");
                }
              }

              if (data.data) setSources(data.data);
            }

            if (data.type === "done") {
              setFinalResearch(data.research);
              setSources(data.research.sources || []);
              toast.success("Research complete! 🎉");
            }

            if (data.type === "error") {
              toast.error(data.message);
            }
          } catch {}
        }
      }
    } catch (err: any) {
      toast.error("Research failed: " + err.message);
    } finally {
      setResearching(false);
    }
  };

  const exampleTopics = [
    "Future of Artificial Intelligence in Healthcare",
    "Climate Change Solutions 2024",
    "Quantum Computing Applications",
    "Electric Vehicle Market Trends",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navbar */}
      <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
          <Brain size={18} className="text-indigo-400" />
          <span className="font-bold text-white text-sm">ResearchAI</span>
        </div>
        <button
          onClick={() => router.push("/history")}
          className="text-xs text-gray-400 hover:text-white transition"
        >
          History →
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* LEFT — Input Panel */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-xl font-bold text-white mb-1">New Research</h1>
              <p className="text-gray-500 text-xs">AI agents aapke liye research karenge</p>
            </motion.div>

            {/* Query Input */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">Research Topic</label>

              {/* ✅ Templates + Schedule + Voice buttons */}
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setShowTemplates(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#1e1e2e] text-gray-500 hover:text-gray-300 text-xs transition"
                >
                  <BookOpen size={11} /> Templates
                </button>
                <button
                  onClick={() => setShowSchedule(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#1e1e2e] text-gray-500 hover:text-gray-300 text-xs transition"
                >
                  <Calendar size={11} /> Schedule
                </button>
                <div className="ml-auto">
                  <VoiceInput onTranscript={(text) => setQuery(text)} />
                </div>
              </div>

              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Future of AI in Healthcare..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#111118] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) startResearch();
                }}
              />
            </div>

            {/* ✅ Language selector */}
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400">Report Language</label>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#111118] text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition"
              >
                <option value="english">🇬🇧 English</option>
                <option value="hindi">🇮🇳 Hindi</option>
                <option value="spanish">🇪🇸 Spanish</option>
                <option value="french">🇫🇷 French</option>
              </select>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-xs text-gray-400">URLs to analyze (optional)</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addUrl()}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 rounded-lg border border-[#1e1e2e] bg-[#111118] text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  onClick={addUrl}
                  className="p-2 rounded-lg border border-[#1e1e2e] hover:border-indigo-500/50 text-gray-400 hover:text-indigo-400 transition"
                >
                  <Plus size={14} />
                </button>
              </div>

              {urls.map((url, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#111118] border border-[#1e1e2e]">
                  <Link size={11} className="text-indigo-400 flex-shrink-0" />
                  <span className="text-xs text-gray-400 truncate flex-1">{url}</span>
                  <button onClick={() => setUrls(urls.filter((_, j) => j !== i))}>
                    <X size={11} className="text-gray-600 hover:text-red-400" />
                  </button>
                </div>
              ))}
            </div>

            {/* Start Button */}
            <button
              onClick={startResearch}
              disabled={researching || !query.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium transition"
            >
              {researching ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Zap size={16} />
              )}
              {researching ? "Researching..." : "Start Research"}
            </button>

            <p className="text-xs text-gray-600 text-center">Ctrl+Enter to start</p>

            {/* Example Topics */}
            {!researching && !finalResearch && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Example topics:</p>
                {exampleTopics.map((topic, i) => (
                  <button
                    key={i}
                    onClick={() => setQuery(topic)}
                    className="w-full text-left px-3 py-2 rounded-lg border border-[#1e1e2e] hover:border-indigo-500/30 text-xs text-gray-500 hover:text-gray-300 transition flex items-center justify-between group"
                  >
                    {topic}
                    <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 transition" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Results Panel */}
          <div className="lg:col-span-3">
            {(researching || finalResearch || streamingReport) ? (
              <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">

                {/* Tabs */}
                <div className="flex items-center border-b border-[#1e1e2e]">
                  {["progress", "report", "sources"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-4 py-3 text-xs font-medium capitalize transition border-b-2 -mb-px ${
                        activeTab === tab
                          ? "border-indigo-500 text-indigo-400"
                          : "border-transparent text-gray-500 hover:text-gray-300"
                      }`}
                    >
                      {tab === "progress" && "🤖 "}
                      {tab === "report" && "📄 "}
                      {tab === "sources" && "🔗 "}
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {tab === "sources" && sources.length > 0 && (
                        <span className="ml-1 text-xs text-gray-600">({sources.length})</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-5 max-h-[600px] overflow-y-auto">
                  {activeTab === "progress" && (
                    <AgentProgress agentStates={agentStates} currentChunk={currentChunk} />
                  )}

                  {activeTab === "report" && (
                    <div>
                      {streamingReport || finalResearch?.report ? (
                        <ReportView
                          report={finalResearch?.report || streamingReport}
                          streaming={researching}
                        />
                      ) : (
                        <div className="text-center py-12 text-gray-600">
                          <p className="text-sm">Report generate ho raha hai...</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "sources" && (
                    <div className="space-y-3">
                      {sources.length > 0 ? (
                        sources.map((source, i) => (
                          <SourceCard key={i} source={source} index={i} />
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-600">
                          <p className="text-sm">Sources load ho rahe hain...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {finalResearch && (
                  <div className="border-t border-[#1e1e2e] px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Reliability: </span>
                      <span className={`font-bold ${
                        finalResearch.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"
                      }`}>
                        {finalResearch.reliabilityScore}%
                      </span>
                      <span>· {sources.length} sources</span>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => router.push(`/research/${finalResearch._id}`)}
                        className="px-3 py-1.5 rounded-lg border border-[#1e1e2e] hover:border-indigo-500/50 text-gray-400 hover:text-white text-xs transition"
                      >
                        View Full →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="border border-dashed border-[#1e1e2e] rounded-2xl h-[400px] flex items-center justify-center text-gray-600">
                <div className="text-center space-y-3">
                  <Brain size={40} className="mx-auto opacity-20" />
                  <p className="text-sm">Topic do aur research start karo</p>
                  <p className="text-xs">4 AI agents parallel mein kaam karenge</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Modals */}
      <AnimatePresence>
        {showTemplates && (
          <ResearchTemplates
            onSelect={(prompt) => setQuery(prompt)}
            onClose={() => setShowTemplates(false)}
          />
        )}
        {showSchedule && (
          <ScheduleResearch onClose={() => setShowSchedule(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}