"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Clock, Brain, Shield, Star } from "lucide-react";
import toast from "react-hot-toast";

export default function ResearchTimeline() {
  const { api } = useAuth();
  const router = useRouter();
  const [timeline, setTimeline] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchTimeline(); }, []);

  const fetchTimeline = async () => {
    try {
      const { data } = await api.get("/research/timeline");
      setTimeline(data.timeline);
    } catch {
      toast.error("Timeline load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-8">
      {Object.entries(timeline).reverse().map(([month, researches]) => (
        <div key={month}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-2 h-2 rounded-full bg-indigo-500" />
            <h3 className="text-sm font-semibold text-white">{month}</h3>
            <span className="text-xs text-gray-600">({researches.length} researches)</span>
          </div>

          <div className="ml-5 border-l border-[#1e1e2e] pl-6 space-y-3">
            {researches.map((research: any) => (
              <motion.div
                key={research._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="relative"
              >
                <div className="absolute -left-9 top-3 w-3 h-3 rounded-full bg-[#1e1e2e] border-2 border-indigo-500/50" />
                <div
                  onClick={() => router.push(`/research/${research._id}`)}
                  className="p-3 rounded-xl border border-[#1e1e2e] hover:border-indigo-500/30 cursor-pointer transition"
                >
                  <p className="text-sm font-medium text-white mb-1">{research.query}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(research.createdAt).toLocaleDateString()}
                    </span>
                    <span className={`flex items-center gap-1 ${research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"}`}>
                      <Shield size={10} /> {research.reliabilityScore}%
                    </span>
                    {research.rating && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Star size={10} /> {research.rating}/5
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}