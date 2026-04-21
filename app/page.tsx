"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Brain, FileText, MessageSquare, Zap, Shield } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const features = [
    { icon: <Search size={20} />, title: "Web Search", desc: "Real internet se latest data fetch karta hai", color: "text-blue-400" },
    { icon: <Brain size={20} />, title: "Multi-Agent AI", desc: "4 specialized AI agents parallel mein kaam karte hain", color: "text-purple-400" },
    { icon: <FileText size={20} />, title: "Report Export", desc: "PDF aur Word mein professional report export karo", color: "text-green-400" },
    { icon: <MessageSquare size={20} />, title: "Chat with Report", desc: "Apni research pe AI se questions pooch", color: "text-cyan-400" },
    { icon: <Shield size={20} />, title: "Fact Checking", desc: "Sources verify karta hai aur reliability score deta hai", color: "text-yellow-400" },
    { icon: <Zap size={20} />, title: "Real-time Progress", desc: "Har agent ka live progress dekho", color: "text-orange-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navbar */}
      <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={20} className="text-indigo-400" />
          <span className="font-bold text-white">ResearchAI</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/auth/login")}
            className="px-4 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-sm transition"
          >
            Login
          </button>
          <button
            onClick={() => router.push("/auth/register")}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-xs mb-6">
            <Zap size={12} /> Powered by Multi-Agent AI
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Research karo{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              10x faster
            </span>
            <br />AI ke saath
          </h1>

          <p className="text-gray-400 text-lg mb-10 max-w-2xl mx-auto">
            Koi bhi topic do — hamare AI agents web search karenge, analyze karenge,
            fact-check karenge aur ek professional report likhenge.
          </p>

          <div className="flex items-center gap-4 justify-center">
            <button
              onClick={() => router.push("/auth/register")}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
            >
              <Brain size={16} /> Start Researching Free
            </button>
            <button
              onClick={() => router.push("/auth/login")}
              className="px-8 py-3 rounded-xl border border-[#1e1e2e] hover:border-indigo-500/50 text-gray-400 hover:text-white transition"
            >
              Login
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20"
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-[#1e1e2e] bg-[#111118] text-left hover:border-indigo-500/30 transition"
            >
              <div className={`mb-3 ${f.color}`}>{f.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-gray-500 text-xs">{f.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}