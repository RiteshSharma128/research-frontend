"use client";
import { motion } from "framer-motion";
import { BookOpen, TrendingUp, Globe, Cpu, Heart, DollarSign, Leaf, Rocket } from "lucide-react";

const TEMPLATES = [
  {
    icon: <TrendingUp size={16} />,
    category: "Business",
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    prompts: [
      "Market analysis of [industry] in 2024",
      "Competitive landscape of [company]",
      "Investment opportunities in [sector]",
    ]
  },
  {
    icon: <Cpu size={16} />,
    category: "Technology",
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    prompts: [
      "Future of Artificial Intelligence in [field]",
      "Impact of [technology] on society",
      "Comparison of [tech1] vs [tech2]",
    ]
  },
  {
    icon: <Heart size={16} />,
    category: "Health",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
    prompts: [
      "Latest research on [disease] treatment",
      "Mental health impact of [factor]",
      "Nutrition science: [topic]",
    ]
  },
  {
    icon: <Leaf size={16} />,
    category: "Environment",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
    prompts: [
      "Climate change solutions for [region]",
      "Renewable energy: [type] analysis",
      "Environmental impact of [industry]",
    ]
  },
  {
    icon: <Globe size={16} />,
    category: "Geopolitics",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
    prompts: [
      "Political situation in [country]",
      "Economic relations between [country1] and [country2]",
      "Impact of [policy] on [region]",
    ]
  },
  {
    icon: <Rocket size={16} />,
    category: "Science",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
    prompts: [
      "Recent discoveries in [field]",
      "Space exploration: [topic]",
      "Quantum computing applications",
    ]
  },
];

interface Props {
  onSelect: (prompt: string) => void;
  onClose: () => void;
}

export default function ResearchTemplates({ onSelect, onClose }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Research Templates</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xs">✕</button>
        </div>

        <div className="p-5 max-h-[500px] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {TEMPLATES.map((template, i) => (
            <div key={i} className={`p-4 rounded-xl border ${template.bg}`}>
              <div className={`flex items-center gap-2 mb-3 ${template.color}`}>
                {template.icon}
                <span className="text-xs font-semibold">{template.category}</span>
              </div>
              <div className="space-y-2">
                {template.prompts.map((prompt, j) => (
                  <button
                    key={j}
                    onClick={() => { onSelect(prompt); onClose(); }}
                    className="w-full text-left text-xs text-gray-400 hover:text-white px-3 py-2 rounded-lg hover:bg-white/5 transition border border-transparent hover:border-[#1e1e2e]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}