
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Brain, Plus, Clock, Globe, Shield,
  TrendingUp, Search, LogOut, History
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import ResearchGraph from "@/components/ResearchGraph";
import ResearchTimeline from "@/components/ResearchTimeline";
import ScheduleResearch from "@/components/ScheduleResearch";
import ScheduledList from "@/components/ScheduledList";

export default function Dashboard() {
  const { user, api, logout } = useAuth();
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);
  const [researches, setResearches] = useState<any[]>([]);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashTab, setDashTab] = useState<"overview" | "graph" | "timeline" | "schedule">("overview");

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const { data } = await api.get("/research");
      setResearches(data.researches);
    } catch {
      toast.error("Data load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    toast.success("Logged out!");
  };

  const chartData = researches.slice(0, 7).reverse().map((r, i) => ({
    name: i + 1,
    reliability: r.reliabilityScore,
    sources: r.sources?.length || 0,
  }));

  const avgReliability = researches.length > 0
    ? Math.round(researches.reduce((a, b) => a + (b.reliabilityScore || 0), 0) / researches.length)
    : 0;

  const totalSources = researches.reduce((a, b) => a + (b.sources?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Navbar */}
      <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain size={18} className="text-indigo-400" />
          <span className="font-bold text-white text-sm">ResearchAI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-500">Hey, {user?.name} 👋</span>
          <button
            onClick={() => router.push("/research")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition"
          >
            <Plus size={12} /> New Research
          </button>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-gray-300 transition"
          >
            <LogOut size={14} />
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Tera research overview</p>
        </motion.div>

        {/* ✅ Tabs */}
        <div className="flex items-center gap-1 border-b border-[#1e1e2e]">
          {[
            { id: "overview", label: "📊 Overview" },
            { id: "graph", label: "🕸️ Graph" },
            { id: "timeline", label: "📅 Timeline" },
            { id: "schedule", label: "⏰ Schedule" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDashTab(tab.id as any)}
              className={`px-4 py-2.5 text-xs font-medium transition border-b-2 -mb-px ${
                dashTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ✅ Graph Tab */}
        {dashTab === "graph" && <ResearchGraph />}

        {/* ✅ Timeline Tab */}
        {dashTab === "timeline" && <ResearchTimeline />}
     

{dashTab === "schedule" && (
  <div className="space-y-6">

    {/* ✅ Button se modal open karo */}
    <button
      onClick={() => setShowScheduleForm(true)}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
    >
      + New Schedule
    </button>

    {/* ✅ Modal — sirf tab show hoga jab button click ho */}
    {showScheduleForm && (
      <ScheduleResearch onClose={() => {
        setShowScheduleForm(false); // ✅ Modal band hoga
        setRefreshKey(prev => prev + 1); // ✅ List refresh hogi
      }} />
    )}

    {/* ✅ Scheduled list */}
    <ScheduledList key={refreshKey} />
  </div>
)}




{/* ✅ Overview Tab */}
        {dashTab === "overview" && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {[
                { label: "Total Research", value: researches.length, icon: <Brain size={16} />, color: "text-indigo-400" },
                { label: "Avg Reliability", value: `${avgReliability}%`, icon: <Shield size={16} />, color: "text-green-400" },
                { label: "Total Sources", value: totalSources, icon: <Globe size={16} />, color: "text-cyan-400" },
                { label: "This Month", value: researches.filter(r => new Date(r.createdAt).getMonth() === new Date().getMonth()).length, icon: <TrendingUp size={16} />, color: "text-purple-400" },
              ].map((stat, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#1e1e2e] bg-[#111118]">
                  <div className={`mb-2 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {chartData.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 rounded-xl border border-[#1e1e2e] bg-[#111118]"
              >
                <h3 className="text-sm font-semibold text-white mb-4">📈 Reliability Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: "#6b7280" }} />
                    <Tooltip contentStyle={{ background: "#111118", border: "1px solid #1e1e2e", borderRadius: 8 }} />
                    <Line type="monotone" dataKey="reliability" stroke="#6366f1" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-white">🕐 Recent Research</h3>
                <button
                  onClick={() => router.push("/history")}
                  className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  <History size={11} /> View All
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                </div>
              ) : researches.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-[#1e1e2e] rounded-2xl">
                  <Search size={28} className="mx-auto mb-3 text-gray-600 opacity-50" />
                  <p className="text-gray-500 text-sm mb-3">Koi research nahi hai</p>
                  <button
                    onClick={() => router.push("/research")}
                    className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition"
                  >
                    Start Research
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {researches.slice(0, 5).map((research) => (
                    <div
                      key={research._id}
                      onClick={() => router.push(`/research/${research._id}`)}
                      className="p-4 rounded-xl border border-[#1e1e2e] hover:border-indigo-500/30 cursor-pointer transition flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                          <Brain size={14} className="text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white line-clamp-1">{research.query}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                            <span className="flex items-center gap-1"><Globe size={10} /> {research.sources?.length || 0}</span>
                            <span className={`flex items-center gap-1 ${research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"}`}>
                              <Shield size={10} /> {research.reliabilityScore}%
                            </span>
                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(research.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-600">→</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}