// "use client";
// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { motion } from "framer-motion";
// import { Brain, Zap, ArrowLeftRight } from "lucide-react";
// import ReportView from "@/components/ReportView";
// import AgentProgress from "@/components/AgentProgress";
// import toast from "react-hot-toast";

// export default function ComparePage() {
//   const { token } = useAuth();
//   const [query1, setQuery1] = useState("");
//   const [query2, setQuery2] = useState("");
//   const [researching1, setResearching1] = useState(false);
//   const [researching2, setResearching2] = useState(false);
//   const [report1, setReport1] = useState("");
//   const [report2, setReport2] = useState("");
//   const [agents1, setAgents1] = useState<Record<string, any>>({});
//   const [agents2, setAgents2] = useState<Record<string, any>>({});
//   const [done1, setDone1] = useState(false);
//   const [done2, setDone2] = useState(false);

//   const research = async (
//     query: string,
//     setResearching: (v: boolean) => void,
//     setReport: (v: string) => void,
//     setAgents: (fn: any) => void,
//     setDone: (v: boolean) => void
//   ) => {
//     if (!query.trim()) return;
//     setResearching(true);
//     setReport("");
//     setDone(false);

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/research/stream`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ query }),
//         }
//       );

//       const reader = response.body!.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;

//         buffer += decoder.decode(value, { stream: true });
//         const lines = buffer.split("\n");
//         buffer = lines.pop() || "";

//         for (const line of lines) {
//           if (!line.startsWith("data: ")) continue;
//           try {
//             const data = JSON.parse(line.slice(6));
//             if (data.type === "agent") {
//               setAgents((prev: any) => ({
//                 ...prev,
//                 [data.agent]: { status: data.status, message: data.message || "" }
//               }));
//               if (data.agent === "writer" && data.chunk) {
//                 setReport((prev: string) => prev + data.chunk);
//               }
//             }
//             if (data.type === "done") {
//               setDone(true);
//               toast.success(`"${query.slice(0, 20)}..." done!`);
//             }
//           } catch {}
//         }
//       }
//     } catch {
//       toast.error("Research failed!");
//     } finally {
//       setResearching(false);
//     }
//   };

//   const startBoth = () => {
//     if (!query1.trim() || !query2.trim()) {
//       toast.error("Dono topics likho!");
//       return;
//     }
//     research(query1, setResearching1, setReport1, setAgents1, setDone1);
//     research(query2, setResearching2, setReport2, setAgents2, setDone2);
//   };

//   return (
//     <div className="min-h-screen bg-[#0a0a0f]">
//       <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center gap-2">
//         <Brain size={16} className="text-indigo-400" />
//         <span className="font-bold text-white text-sm">ResearchAI</span>
//         <span className="text-xs text-gray-500 ml-2">Compare</span>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6"
//         >
//           <h1 className="text-2xl font-bold text-white mb-1">Compare Research</h1>
//           <p className="text-gray-500 text-sm">2 topics side by side research karo</p>
//         </motion.div>

//         {/* Input Row */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <input
//             value={query1}
//             onChange={(e) => setQuery1(e.target.value)}
//             placeholder="Topic 1: e.g. Solar Energy"
//             className="px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#111118] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
//           />
//           <input
//             value={query2}
//             onChange={(e) => setQuery2(e.target.value)}
//             placeholder="Topic 2: e.g. Wind Energy"
//             className="px-4 py-3 rounded-xl border border-[#1e1e2e] bg-[#111118] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
//           />
//         </div>

//         <div className="flex justify-center mb-6">
//           <button
//             onClick={startBoth}
//             disabled={researching1 || researching2}
//             className="flex items-center gap-2 px-8 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium transition"
//           >
//             {(researching1 || researching2) ? (
//               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
//             ) : (
//               <ArrowLeftRight size={16} />
//             )}
//             Compare Both
//           </button>
//         </div>

//         {/* Side by Side Results */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {/* Left */}
//           <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">
//             <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#111118] flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-indigo-500" />
//               <span className="text-sm font-medium text-white truncate">{query1 || "Topic 1"}</span>
//               {researching1 && <div className="w-3 h-3 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin ml-auto" />}
//               {done1 && <span className="text-xs text-green-400 ml-auto">✓ Done</span>}
//             </div>
//             <div className="p-4 max-h-[600px] overflow-y-auto">
//               {(researching1 && !report1) && <AgentProgress agentStates={agents1} />}
//               {report1 && <ReportView report={report1} streaming={researching1} />}
//               {!researching1 && !report1 && (
//                 <div className="text-center py-12 text-gray-600">
//                   <Brain size={28} className="mx-auto mb-2 opacity-20" />
//                   <p className="text-sm">Topic 1 likho</p>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Right */}
//           <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">
//             <div className="px-4 py-3 border-b border-[#1e1e2e] bg-[#111118] flex items-center gap-2">
//               <div className="w-2 h-2 rounded-full bg-cyan-500" />
//               <span className="text-sm font-medium text-white truncate">{query2 || "Topic 2"}</span>
//               {researching2 && <div className="w-3 h-3 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin ml-auto" />}
//               {done2 && <span className="text-xs text-green-400 ml-auto">✓ Done</span>}
//             </div>
//             <div className="p-4 max-h-[600px] overflow-y-auto">
//               {(researching2 && !report2) && <AgentProgress agentStates={agents2} />}
//               {report2 && <ReportView report={report2} streaming={researching2} />}
//               {!researching2 && !report2 && (
//                 <div className="text-center py-12 text-gray-600">
//                   <Brain size={28} className="mx-auto mb-2 opacity-20" />
//                   <p className="text-sm">Topic 2 likho</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Brain, ArrowLeftRight } from "lucide-react";
import ReportView from "@/components/ReportView";
import AgentProgress from "@/components/AgentProgress";
import toast from "react-hot-toast";

export default function ComparePage() {
  const { token } = useAuth();

  const [query1, setQuery1] = useState<string>("");
  const [query2, setQuery2] = useState<string>("");

  const [researching1, setResearching1] = useState<boolean>(false);
  const [researching2, setResearching2] = useState<boolean>(false);

  const [report1, setReport1] = useState<string>("");
  const [report2, setReport2] = useState<string>("");

  const [agents1, setAgents1] = useState<Record<string, any>>({});
  const [agents2, setAgents2] = useState<Record<string, any>>({});

  const [done1, setDone1] = useState<boolean>(false);
  const [done2, setDone2] = useState<boolean>(false);

  // ✅ FIX: Proper typing for setReport
 const research = async (
  query: string,
  setResearching: React.Dispatch<React.SetStateAction<boolean>>,
  setReport: React.Dispatch<React.SetStateAction<string>>,
  setAgents: React.Dispatch<React.SetStateAction<Record<string, any>>>,
  setDone: React.Dispatch<React.SetStateAction<boolean>>
) => {
    if (!query.trim()) return;

    setResearching(true);
    setReport("");
    setDone(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/research/stream`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query }),
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

            if (data.type === "agent") {
              setAgents((prev) => ({
                ...prev,
                [data.agent]: {
                  status: data.status,
                  message: data.message || "",
                },
              }));

              // ✅ FIXED LINE
              if (data.agent === "writer" && data.chunk) {
                setReport((prev) => prev + data.chunk);
              }
            }

            if (data.type === "done") {
              setDone(true);
              toast.success(`"${query.slice(0, 20)}..." done!`);
            }
          } catch (err) {
            console.error(err);
          }
        }
      }
    } catch (err) {
      toast.error("Research failed!");
    } finally {
      setResearching(false);
    }
  };

  const startBoth = () => {
    if (!query1.trim() || !query2.trim()) {
      toast.error("Dono topics likho!");
      return;
    }

    research(query1, setResearching1, setReport1, setAgents1, setDone1);
    research(query2, setResearching2, setReport2, setAgents2, setDone2);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center gap-2">
        <Brain size={16} className="text-indigo-400" />
        <span className="font-bold text-white text-sm">ResearchAI</span>
        <span className="text-xs text-gray-500 ml-2">Compare</span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-2xl font-bold text-white mb-1">
            Compare Research
          </h1>
          <p className="text-gray-500 text-sm">
            2 topics side by side research karo
          </p>
        </motion.div>

        {/* Inputs */}
        <div className="grid md:grid-cols-2 gap-4 my-4">
          <input
            value={query1}
            onChange={(e) => setQuery1(e.target.value)}
            placeholder="Topic 1"
            className="p-3 bg-[#111118] text-white rounded-xl"
          />
          <input
            value={query2}
            onChange={(e) => setQuery2(e.target.value)}
            placeholder="Topic 2"
            className="p-3 bg-[#111118] text-white rounded-xl"
          />
        </div>

        <button
          onClick={startBoth}
          className="bg-indigo-600 px-6 py-3 rounded-xl text-white"
        >
          <ArrowLeftRight size={16} /> Compare
        </button>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <ReportView report={report1} streaming={researching1} />
          <ReportView report={report2} streaming={researching2} />
        </div>
      </div>
    </div>
  );
}
