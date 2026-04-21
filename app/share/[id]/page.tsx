"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Brain, Globe, Shield, Clock } from "lucide-react";
import ReportView from "@/components/ReportView";
import SourceCard from "@/components/SourceCard";
import toast from "react-hot-toast";

export default function SharePage() {
  const { id } = useParams();
  const [research, setResearch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/research/public/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.research) setResearch(data.research);
        else toast.error("Research not found!");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!research) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <p className="text-gray-500">Research not found!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center gap-2">
        <Brain size={16} className="text-indigo-400" />
        <span className="font-bold text-white text-sm">ResearchAI</span>
        <span className="text-xs text-gray-500 ml-2">Shared Report</span>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-2">{research.query}</h1>
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-6">
          <span className="flex items-center gap-1"><Globe size={10} /> {research.sources?.length} sources</span>
          <span className="flex items-center gap-1">
            <Shield size={10} />
            <span className={research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"}>
              {research.reliabilityScore}%
            </span>
          </span>
          <span className="flex items-center gap-1"><Clock size={10} /> {new Date(research.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="p-6 rounded-2xl border border-[#1e1e2e] bg-[#111118] mb-6">
          <ReportView report={research.report} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {research.sources?.map((source: any, i: number) => (
            <SourceCard key={i} source={source} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}