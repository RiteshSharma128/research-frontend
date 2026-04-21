"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Clock, Calendar, Trash2, Brain } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ScheduledList() {
  const { api } = useAuth();
  const [scheduled, setScheduled] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchScheduled(); }, []);

  const fetchScheduled = async () => {
    try {
      const { data } = await api.get("/research");
      // ✅ Sirf scheduled research filter karo
      const scheduledOnly = (data.researches || []).filter(
        (r: any) => r.isScheduled === true
      );
      setScheduled(scheduledOnly);
    } catch {
      toast.error("Scheduled load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  const deleteScheduled = async (id: string) => {
    try {
      await api.delete(`/research/${id}`);
      setScheduled(prev => prev.filter(r => r._id !== id));
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-8">
      <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center gap-2">
        <Calendar size={14} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">
          Scheduled Research
        </h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-500">
          {scheduled.length}
        </span>
      </div>

      {scheduled.length === 0 ? (
        <div className="text-center py-12">
          <Clock size={28} className="mx-auto mb-3 text-gray-600 opacity-30" />
          <p className="text-gray-500 text-sm">Koi scheduled research nahi hai</p>
          <p className="text-gray-600 text-xs mt-1">
            Upar form se schedule karo
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#1e1e2e]">
          {scheduled.map((research) => (
            <motion.div
              key={research._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="px-5 py-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Brain size={14} className="text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {research.query}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {new Date(research.scheduledAt).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(research.scheduledAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>
                    {/* ✅ Status */}
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      new Date(research.scheduledAt) > new Date()
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-green-500/20 text-green-400"
                    }`}>
                      {new Date(research.scheduledAt) > new Date()
                        ? "⏳ Pending"
                        : "✅ Due"
                      }
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteScheduled(research._id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}