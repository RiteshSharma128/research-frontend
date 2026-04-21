"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Brain, Shield, FileText, CheckCircle, Loader, Globe } from "lucide-react";

interface Agent {
  id: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

const AGENTS: Agent[] = [
  { id: "search", label: "Search Agent", icon: <Search size={14} />, color: "text-blue-400" },
  { id: "urlanalyzer", label: "URL Analyzer", icon: <Globe size={14} />, color: "text-cyan-400" },
  { id: "analyzer", label: "Analysis Agent", icon: <Brain size={14} />, color: "text-purple-400" },
  { id: "factchecker", label: "Fact Checker", icon: <Shield size={14} />, color: "text-yellow-400" },
  { id: "writer", label: "Report Writer", icon: <FileText size={14} />, color: "text-green-400" },
];

interface AgentProgressProps {
  agentStates: Record<string, { status: string; message: string }>;
  currentChunk?: string;
}

export default function AgentProgress({ agentStates, currentChunk }: AgentProgressProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-white mb-4">🤖 AI Agents Working...</h3>
      {AGENTS.map((agent) => {
        const state = agentStates[agent.id];
        if (!state) return null;

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-xl border ${
              state.status === "done"
                ? "border-green-500/20 bg-green-500/5"
                : state.status === "error"
                ? "border-red-500/20 bg-red-500/5"
                : "border-[#1e1e2e] bg-[#111118]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={agent.color}>{agent.icon}</span>
                <span className="text-xs font-medium text-white">{agent.label}</span>
              </div>
              <div>
                {state.status === "done" && <CheckCircle size={14} className="text-green-400" />}
                {(state.status === "running" || state.status === "streaming") && (
                  <Loader size={14} className="text-indigo-400 animate-spin" />
                )}
                {state.status === "error" && <span className="text-xs text-red-400">Error</span>}
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{state.message}</p>

            {/* Streaming preview */}
            {state.status === "streaming" && currentChunk && (
              <div className="mt-2 p-2 rounded-lg bg-[#0a0a0f] border border-[#1e1e2e]">
                <p className="text-xs text-gray-400 font-mono line-clamp-2">{currentChunk}</p>
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}