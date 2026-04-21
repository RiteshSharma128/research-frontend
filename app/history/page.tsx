// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import { Brain, Clock, Globe, Shield, Trash2, Plus } from "lucide-react";
// import { useAuth } from "@/context/AuthContext";
// import toast from "react-hot-toast";

// export default function HistoryPage() {
//   const { api } = useAuth();
//   const router = useRouter();
//   const [researches, setResearches] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { fetchHistory(); }, []);

//   const fetchHistory = async () => {
//     try {
//       const { data } = await api.get("/research");
//       setResearches(data.researches);
//     } catch {
//       toast.error("History load nahi hui");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const deleteResearch = async (id: string) => {
//     try {
//       await api.delete(`/research/${id}`);
//       setResearches(prev => prev.filter(r => r._id !== id));
//       toast.success("Deleted!");
//     } catch {
//       toast.error("Delete failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0f] px-4 py-8">
//       <div className="max-w-4xl mx-auto">

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="flex items-center justify-between mb-8"
//         >
//           <div>
//             <h1 className="text-2xl font-bold text-white">Research History</h1>
//             <p className="text-gray-500 text-sm mt-1">{researches.length} researches</p>
//           </div>
//           <button
//             onClick={() => router.push("/research")}
//             className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
//           >
//             <Plus size={14} /> New Research
//           </button>
//         </motion.div>

//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
//           </div>
//         ) : researches.length === 0 ? (
//           <div className="text-center py-24">
//             <Brain size={40} className="mx-auto mb-4 opacity-20 text-gray-500" />
//             <p className="text-gray-500 mb-4">Koi research nahi hai</p>
//             <button
//               onClick={() => router.push("/research")}
//               className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
//             >
//               Start Research
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {researches.map((research) => (
//               <motion.div
//                 key={research._id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className="p-4 rounded-2xl border border-[#1e1e2e] hover:border-indigo-500/30 cursor-pointer transition flex items-center justify-between"
//                 onClick={() => router.push(`/research/${research._id}`)}
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
//                     <Brain size={16} className="text-indigo-400" />
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-white">{research.query}</p>
//                     <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
//                       <span className="flex items-center gap-1">
//                         <Globe size={10} /> {research.sources?.length || 0} sources
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Shield size={10} />
//                         <span className={research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"}>
//                           {research.reliabilityScore}%
//                         </span>
//                       </span>
//                       <span className="flex items-center gap-1">
//                         <Clock size={10} />
//                         {new Date(research.createdAt).toLocaleDateString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <button
//                   onClick={(e) => { e.stopPropagation(); deleteResearch(research._id); }}
//                   className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition"
//                 >
//                   <Trash2 size={14} />
//                 </button>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Clock, Globe, Shield, Trash2, Plus, GitCompare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { api } = useAuth();
  const router = useRouter();
  const [researches, setResearches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchHistory(); }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get("/research");
      setResearches(data.researches);
    } catch {
      toast.error("History load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  const deleteResearch = async (id: string) => {
    try {
      await api.delete(`/research/${id}`);
      setResearches(prev => prev.filter(r => r._id !== id));
      toast.success("Deleted!");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-4 py-8">
      <div className="max-w-4xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Research History</h1>
            <p className="text-gray-500 text-sm mt-1">{researches.length} researches</p>
          </div>
          <button
            onClick={() => router.push("/research")}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
          >
            <Plus size={14} /> New Research
          </button>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : researches.length === 0 ? (
          <div className="text-center py-24">
            <Brain size={40} className="mx-auto mb-4 opacity-20 text-gray-500" />
            <p className="text-gray-500 mb-4">Koi research nahi hai</p>
            <button
              onClick={() => router.push("/research")}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm transition"
            >
              Start Research
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {researches.map((research) => (
              <motion.div
                key={research._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl border border-[#1e1e2e] hover:border-indigo-500/30 cursor-pointer transition flex items-center justify-between"
                onClick={() => router.push(`/research/${research._id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                    <Brain size={16} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{research.query}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Globe size={10} /> {research.sources?.length || 0} sources
                      </span>
                      <span className="flex items-center gap-1">
                        <Shield size={10} />
                        <span className={research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"}>
                          {research.reliabilityScore}%
                        </span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(research.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ Action buttons */}
                <div className="flex items-center gap-2">
                  {/* ✅ Compare button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/compare?id=${research._id}`);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs border border-[#1e1e2e] text-gray-500 hover:text-white hover:border-indigo-500/50 transition"
                  >
                    <GitCompare size={11} /> Compare
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteResearch(research._id); }}
                    className="p-2 rounded-lg hover:bg-red-500/10 text-gray-600 hover:text-red-400 transition"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}