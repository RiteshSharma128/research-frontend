"use client";
import { useState } from "react";
import { Calendar, Clock, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface Props {
  onClose: () => void;
}

export default function ScheduleResearch({ onClose }: Props) {
  const { api } = useAuth();
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [loading, setLoading] = useState(false);

  const handleSchedule = async () => {
    if (!query || !date) { toast.error("Query aur date dono bharo!"); return; }

    setLoading(true);
    try {
      const scheduledAt = new Date(`${date}T${time}`).toISOString();
      await api.post("/research/schedule", { query, scheduledAt });
      toast.success("Research scheduled! ✅");
      onClose();
    } catch {
      toast.error("Schedule failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-md bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#1e1e2e] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-indigo-400" />
            <h2 className="text-sm font-semibold text-white">Schedule Research</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-300">
            <X size={14} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-gray-400">Research Topic</label>
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Kaunsa topic research karna hai?"
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-gray-400">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-[#1e1e2e] text-gray-400 text-sm transition hover:border-gray-500"
            >
              Cancel
            </button>
            <button
              onClick={handleSchedule}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Clock size={14} /> Schedule</>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}