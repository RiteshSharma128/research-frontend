// "use client";
// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { motion } from "framer-motion";
// import {
//   ArrowLeft, Download, MessageSquare,
//   Shield, Globe, Send, Loader, Bot, User
// } from "lucide-react";
// import toast from "react-hot-toast";
// import { useAuth } from "@/context/AuthContext";
// import ReportView from "@/components/ReportView";
// import SourceCard from "@/components/SourceCard";
// import jsPDF from "jspdf";

// export default function ResearchDetail() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { api, token } = useAuth();

//   const [research, setResearch] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<"report" | "sources" | "chat">("report");
//   const [chatMessages, setChatMessages] = useState<any[]>([]);
//   const [chatInput, setChatInput] = useState("");
//   const [chatLoading, setChatLoading] = useState(false);
//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   useEffect(() => { fetchResearch(); }, [id]);
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [chatMessages]);

//   const fetchResearch = async () => {
//     try {
//       const { data } = await api.get(`/research/${id}`);
//       setResearch(data.research);
//     } catch {
//       toast.error("Research load nahi hui");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(research.query, 20, 20);
//     doc.setFontSize(10);
//     const lines = doc.splitTextToSize(research.report.replace(/[#*`]/g, ""), 170);
//     doc.text(lines, 20, 35);
//     doc.save(`${research.query.slice(0, 30)}.pdf`);
//     toast.success("PDF exported! 📄");
//   };

//   const sendChat = async () => {
//     if (!chatInput.trim() || chatLoading) return;

//     const userMsg = chatInput.trim();
//     setChatInput("");
//     setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
//     setChatMessages(prev => [...prev, { role: "assistant", content: "", streaming: true }]);
//     setChatLoading(true);

//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/research/${id}/chat`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             message: userMsg,
//             history: chatMessages.filter(m => !m.streaming).slice(-6),
//           }),
//         }
//       );

//       const reader = response.body!.getReader();
//       const decoder = new TextDecoder();
//       let buffer = "";
//       let fullText = "";

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
//             if (data.chunk) {
//               fullText += data.chunk;
//               setChatMessages(prev => prev.map((m, i) =>
//                 i === prev.length - 1 && m.streaming
//                   ? { ...m, content: fullText }
//                   : m
//               ));
//             }
//             if (data.done) {
//               setChatMessages(prev => prev.map((m, i) =>
//                 i === prev.length - 1 ? { ...m, streaming: false } : m
//               ));
//             }
//           } catch {}
//         }
//       }
//     } catch {
//       toast.error("Chat failed!");
//     } finally {
//       setChatLoading(false);
//     }
//   };

//   if (loading) return (
//     <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
//       <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
//     </div>
//   );

//   if (!research) return null;



//   const exportDOCX = async () => {
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/research/${id}/export/docx`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//     const blob = await res.blob();
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${research.query.slice(0, 30)}.docx`;
//     a.click();
//     toast.success("DOCX exported! 📝");
//   };
  

//   return (
//     <div className="min-h-screen bg-[#0a0a0f]">
//       {/* Navbar */}
//       <nav className="border-b border-[#1e1e2e] px-6 py-4 flex items-center justify-between">
//         <button
//           onClick={() => router.back()}
//           className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
//         >
//           <ArrowLeft size={16} /> Back
//         </button>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={exportPDF}
//             className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] hover:border-indigo-500/50 text-gray-400 hover:text-white text-xs transition"
//           >
//             <Download size={13} /> Export PDF
//           </button>
//         </div>
//       </nav>

//       <div className="max-w-5xl mx-auto px-4 py-8">

//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mb-6"
//         >
//           <h1 className="text-2xl font-bold text-white mb-2">{research.query}</h1>
//           <div className="flex items-center gap-4 text-xs text-gray-500">
//             <span className="flex items-center gap-1">
//               <Globe size={11} /> {research.sources?.length || 0} sources
//             </span>
//             <span className="flex items-center gap-1">
//               <Shield size={11} />
//               Reliability: <span className={`font-bold ml-1 ${
//                 research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"
//               }`}>{research.reliabilityScore}%</span>
//             </span>
//             <span>{new Date(research.createdAt).toLocaleDateString()}</span>
//           </div>
//         </motion.div>

//         {/* Tabs */}
//         <div className="flex items-center gap-1 border-b border-[#1e1e2e] mb-6">
//           {[
//             { id: "report", label: "📄 Report" },
//             { id: "sources", label: `🔗 Sources (${research.sources?.length || 0})` },
//             { id: "chat", label: "💬 Chat" },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id as any)}
//               className={`px-4 py-2.5 text-xs font-medium transition border-b-2 -mb-px ${
//                 activeTab === tab.id
//                   ? "border-indigo-500 text-indigo-400"
//                   : "border-transparent text-gray-500 hover:text-gray-300"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>


//         <button onClick={exportDOCX} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition">
//   <Download size={13} /> Export DOCX
// </button>

//         {/* Report Tab */}
//         {activeTab === "report" && (
//           <div className="p-6 rounded-2xl border border-[#1e1e2e] bg-[#111118]">
//             <ReportView report={research.report} />
//           </div>
//         )}

//         {/* Sources Tab */}
//         {activeTab === "sources" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//             {research.sources?.map((source: any, i: number) => (
//               <SourceCard key={i} source={source} index={i} />
//             ))}
//           </div>
//         )}

//         {/* Chat Tab */}
//         {activeTab === "chat" && (
//           <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">
//             <div className="p-4 border-b border-[#1e1e2e] flex items-center gap-2">
//               <MessageSquare size={14} className="text-indigo-400" />
//               <span className="text-sm font-medium text-white">Chat with Research</span>
//             </div>

//             <div className="h-[400px] overflow-y-auto p-4 space-y-4">
//               {chatMessages.length === 0 && (
//                 <div className="text-center py-12 text-gray-600">
//                   <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
//                   <p className="text-sm">Research ke baare mein kuch pooch</p>
//                 </div>
//               )}
//               {chatMessages.map((msg, i) => (
//                 <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
//                   <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
//                     msg.role === "user"
//                       ? "bg-indigo-500/20 border border-indigo-500/30"
//                       : "bg-cyan-500/20 border border-cyan-500/30"
//                   }`}>
//                     {msg.role === "user"
//                       ? <User size={12} className="text-indigo-400" />
//                       : <Bot size={12} className="text-cyan-400" />
//                     }
//                   </div>
//                   <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
//                     msg.role === "user"
//                       ? "bg-indigo-600/20 border border-indigo-500/20 text-gray-200"
//                       : "bg-[#111118] border border-[#1e1e2e] text-gray-300"
//                   }`}>
//                     {msg.content}
//                     {msg.streaming && (
//                       <span className="inline-block w-1.5 h-3 bg-cyan-500 ml-0.5 animate-pulse" />
//                     )}
//                   </div>
//                 </div>
//               ))}
//               <div ref={messagesEndRef} />
//             </div>

//             <div className="border-t border-[#1e1e2e] p-4 flex gap-2">
//               <input
//                 type="text"
//                 value={chatInput}
//                 onChange={(e) => setChatInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && sendChat()}
//                 placeholder="Kuch pooch..."
//                 className="flex-1 px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#111118] text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
//               />
//               <button
//                 onClick={sendChat}
//                 disabled={!chatInput.trim() || chatLoading}
//                 className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition"
//               >
//                 {chatLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft, Download, MessageSquare, Shield, Globe,
  Send, Loader, Bot, User, Star, Bookmark, Share2,
  Mail, Languages, FileText, CheckCircle, GitCompare
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import ReportView from "@/components/ReportView";
import SourceCard from "@/components/SourceCard";
import jsPDF from "jspdf";

export default function ResearchDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { api, token } = useAuth();

  const [research, setResearch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("report");

  // Chat
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rating
  const [rating, setRating] = useState(0);

  // Bookmark
  const [selectedText, setSelectedText] = useState("");
  const [bookmarks, setBookmarks] = useState<any[]>([]);

  // Share
  const [shareUrl, setShareUrl] = useState("");

  // Email
  const [showEmail, setShowEmail] = useState(false);
  const [emailTo, setEmailTo] = useState("");

  // Translate
  const [translateLang, setTranslateLang] = useState("hindi");
  const [translating, setTranslating] = useState(false);

  // Summary
  const [summary, setSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Collaborate
  const [collabEmail, setCollabEmail] = useState("");
  const [showCollab, setShowCollab] = useState(false);

  useEffect(() => { fetchResearch(); }, [id]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const fetchResearch = async () => {
    try {
      const { data } = await api.get(`/research/${id}`);
      setResearch(data.research);
      setRating(data.research.rating || 0);
      setBookmarks(data.research.bookmarks || []);
    } catch {
      toast.error("Research load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Export PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(research.query, 20, 20);
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(research.report.replace(/[#*`]/g, ""), 170);
    doc.text(lines, 20, 35);
    doc.save(`${research.query.slice(0, 30)}.pdf`);
    toast.success("PDF exported! 📄");
  };

  // ✅ Export DOCX
  const exportDOCX = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/research/${id}/export/docx`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${research.query.slice(0, 30)}.docx`;
    a.click();
    toast.success("DOCX exported! 📝");
  };

  // ✅ Rating
  const rateResearch = async (r: number) => {
    try {
      await api.post(`/research/${id}/rate`, { rating: r });
      setRating(r);
      toast.success("Rating saved! ⭐");
    } catch {
      toast.error("Rating failed");
    }
  };

  // ✅ Bookmark
  const addBookmark = async () => {
    if (!selectedText) return;
    try {
      const { data } = await api.post(`/research/${id}/bookmark`, { text: selectedText });
      setBookmarks(data.bookmarks);
      setSelectedText("");
      toast.success("Bookmarked! 🔖");
    } catch {
      toast.error("Bookmark failed");
    }
  };

  // ✅ Share
  const shareResearch = async () => {
    try {
      const { data } = await api.post(`/research/${id}/share`);
      setShareUrl(data.shareUrl);
      navigator.clipboard.writeText(data.shareUrl);
      toast.success("Link copied! 🔗");
    } catch {
      toast.error("Share failed");
    }
  };

  // ✅ Email
  const sendEmail = async () => {
    try {
      await api.post(`/research/${id}/email`, { to: emailTo });
      toast.success("Email sent! 📧");
      setShowEmail(false);
      setEmailTo("");
    } catch {
      toast.error("Email failed");
    }
  };

  // ✅ Translate
  const translateReport = async () => {
    setTranslating(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/research/${id}/translate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ language: translateLang }),
        }
      );
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let translated = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        const lines = text.split("\n").filter(l => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.chunk) translated += data.chunk;
          } catch {}
        }
      }
      setResearch((prev: any) => ({ ...prev, report: translated }));
      toast.success("Translated! 🌍");
    } catch {
      toast.error("Translation failed");
    } finally {
      setTranslating(false);
    }
  };

  // ✅ Summary
  const generateSummary = async () => {
    setSummaryLoading(true);
    try {
      const { data } = await api.post(`/research/${id}/summary`);
      setSummary(data.summary);
      toast.success("Summary ready! 📝");
    } catch {
      toast.error("Summary failed");
    } finally {
      setSummaryLoading(false);
    }
  };

  // ✅ Collaborate
  const addCollaborator = async () => {
    try {
      await api.post(`/research/${id}/collaborate`, { email: collabEmail });
      toast.success("Collaborator added! 🤝");
      setCollabEmail("");
      setShowCollab(false);
    } catch {
      toast.error("Collaboration failed");
    }
  };

  // ✅ Chat
  const sendChat = async () => {
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setChatMessages(prev => [...prev, { role: "assistant", content: "", streaming: true }]);
    setChatLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"}/research/${id}/chat`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            message: userMsg,
            history: chatMessages.filter(m => !m.streaming).slice(-6),
          }),
        }
      );
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let fullText = "";
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
            if (data.chunk) {
              fullText += data.chunk;
              setChatMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 && m.streaming ? { ...m, content: fullText } : m
              ));
            }
            if (data.done) {
              setChatMessages(prev => prev.map((m, i) =>
                i === prev.length - 1 ? { ...m, streaming: false } : m
              ));
            }
          } catch {}
        }
      }
    } catch {
      toast.error("Chat failed!");
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!research) return null;

  const tabs = [
    { id: "report", label: "📄 Report" },
    { id: "sources", label: `🔗 Sources (${research.sources?.length || 0})` },
    { id: "chat", label: "💬 Chat" },
    { id: "summary", label: "📝 Summary" },
    { id: "factcheck", label: "✅ Fact Check" },
    { id: "bookmarks", label: "🔖 Bookmarks" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* ✅ Navbar */}
      <nav className="border-b border-[#1e1e2e] px-6 py-3 flex items-center justify-between sticky top-0 bg-[#0a0a0f] z-50">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* ✅ Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">

          {/* Rating */}
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map((star) => (
              <button key={star} onClick={() => rateResearch(star)}>
                <Star size={14} className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} />
              </button>
            ))}
          </div>

          {/* Compare */}
          <button
            onClick={() => router.push(`/compare?id=${id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition"
          >
            <GitCompare size={13} /> Compare
          </button>

          {/* Share */}
          <button
            onClick={shareResearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition"
          >
            <Share2 size={13} /> Share
          </button>

          {/* Email */}
          <button
            onClick={() => setShowEmail(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition"
          >
            <Mail size={13} /> Email
          </button>

          {/* Collaborate */}
          <button
            onClick={() => setShowCollab(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition"
          >
            🤝 Collab
          </button>

          {/* Translate */}
          <select
            value={translateLang}
            onChange={(e) => setTranslateLang(e.target.value)}
            className="px-2 py-1.5 rounded-lg border border-[#1e1e2e] bg-[#111118] text-xs text-gray-400 focus:outline-none"
          >
            <option value="hindi">🇮🇳 Hindi</option>
            <option value="english">🇬🇧 English</option>
            <option value="spanish">🇪🇸 Spanish</option>
            <option value="french">🇫🇷 French</option>
          </select>
          <button
            onClick={translateReport}
            disabled={translating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition disabled:opacity-50"
          >
            <Languages size={13} /> {translating ? "..." : "Translate"}
          </button>

          {/* Export PDF */}
          <button
            onClick={exportPDF}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition"
          >
            <Download size={13} /> PDF
          </button>

          {/* Export DOCX */}
          <button
            onClick={exportDOCX}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#1e1e2e] text-gray-400 hover:text-white text-xs transition"
          >
            <FileText size={13} /> DOCX
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">{research.query}</h1>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Globe size={11} /> {research.sources?.length || 0} sources</span>
            <span className="flex items-center gap-1">
              <Shield size={11} />
              Reliability: <span className={`font-bold ml-1 ${research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"}`}>
                {research.reliabilityScore}%
              </span>
            </span>
            <span>{new Date(research.createdAt).toLocaleDateString()}</span>
          </div>

          {/* ✅ Share URL */}

          {/* {shareUrl && (
            <div className="mt-3 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-400 break-all">
              🔗 {shareUrl}
            </div>
          )} */}


{/* ✅ YAHAN ADD KARO — Header ke neeche */}
  {shareUrl && (
    <div className="mt-3 p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
      <p className="text-xs text-gray-400 mb-1">Public Link:</p>
      <div className="flex items-center gap-2">
        <p className="text-xs text-indigo-400 break-all flex-1">{shareUrl}</p>
        <button
          onClick={() => { navigator.clipboard.writeText(shareUrl); toast.success("Copied!"); }}
          className="px-2 py-1 rounded-lg bg-indigo-600 text-white text-xs flex-shrink-0"
        >
          Copy
        </button>
        <button
          onClick={() => window.open(shareUrl, "_blank")}
          className="px-2 py-1 rounded-lg border border-[#1e1e2e] text-gray-400 text-xs flex-shrink-0"
        >
          Open
        </button>
      </div>
    </div>
  )}


        </motion.div>

        {/* ✅ Tabs */}
        <div className="flex items-center gap-1 border-b border-[#1e1e2e] mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-xs font-medium transition border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ✅ Report Tab */}
        {/* {activeTab === "report" && (
          <div
            className="p-6 rounded-2xl border border-[#1e1e2e] bg-[#111118]"
            onMouseUp={() => {
              const sel = window.getSelection()?.toString();
              if (sel && sel.length > 10) setSelectedText(sel);
            }}
          >
            <ReportView report={research.report} />
          </div>
        )} */}


{/* ✅ Report Tab — YAHAN replace karo */}
{activeTab === "report" && (
  <div
    className="p-6 rounded-2xl border border-[#1e1e2e] bg-[#111118]"
    onMouseUp={() => {
      const sel = window.getSelection()?.toString();
      if (sel && sel.length > 10) setSelectedText(sel);
    }}
  >
    <ReportView report={research.report} />
    {/* ✅ Instruction */}
    <p className="text-xs text-gray-600 mt-4 text-center">
      💡 Text select karo aur bookmark karo
    </p>
  </div>
)}

        {/* ✅ Sources Tab */}
        {activeTab === "sources" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {research.sources?.map((source: any, i: number) => (
              <SourceCard key={i} source={source} index={i} />
            ))}
          </div>
        )}

        {/* ✅ Chat Tab */}
        {activeTab === "chat" && (
          <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-[#1e1e2e] flex items-center gap-2">
              <MessageSquare size={14} className="text-indigo-400" />
              <span className="text-sm font-medium text-white">Chat with Research</span>
            </div>
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  <MessageSquare size={24} className="mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Research ke baare mein kuch pooch</p>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center ${
                    msg.role === "user" ? "bg-indigo-500/20 border border-indigo-500/30" : "bg-cyan-500/20 border border-cyan-500/30"
                  }`}>
                    {msg.role === "user" ? <User size={12} className="text-indigo-400" /> : <Bot size={12} className="text-cyan-400" />}
                  </div>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-indigo-600/20 border border-indigo-500/20 text-gray-200"
                      : "bg-[#111118] border border-[#1e1e2e] text-gray-300"
                  }`}>
                    {msg.content}
                    {msg.streaming && <span className="inline-block w-1.5 h-3 bg-cyan-500 ml-0.5 animate-pulse" />}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-[#1e1e2e] p-4 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChat()}
                placeholder="Kuch pooch..."
                className="flex-1 px-3 py-2 rounded-xl border border-[#1e1e2e] bg-[#111118] text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
              />
              <button
                onClick={sendChat}
                disabled={!chatInput.trim() || chatLoading}
                className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white transition"
              >
                {chatLoading ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </div>
          </div>
        )}

        {/* ✅ Summary Tab */}
        {activeTab === "summary" && (
          <div className="border border-[#1e1e2e] rounded-2xl overflow-hidden">
            {summary ? (
              <div className="p-6">
                <ReportView report={summary} />
              </div>
            ) : (
              <div className="text-center py-16">
                <FileText size={32} className="mx-auto mb-4 text-gray-600 opacity-30" />
                <p className="text-gray-500 text-sm mb-4">AI 1-page summary generate karega</p>
                <button
                  onClick={generateSummary}
                  disabled={summaryLoading}
                  className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm disabled:opacity-50 transition"
                >
                  {summaryLoading ? "Generating..." : "🧠 Generate Summary"}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ✅ Fact Check Tab */}
        {activeTab === "factcheck" && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl border border-[#1e1e2e] bg-[#111118]">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle size={20} className="text-green-400" />
                <h3 className="text-sm font-semibold text-white">Fact Check Results</h3>
              </div>

              {/* Reliability Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400">Reliability Score</span>
                  <span className={`text-sm font-bold ${research.reliabilityScore >= 75 ? "text-green-400" : "text-yellow-400"}`}>
                    {research.reliabilityScore}%
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#1e1e2e]">
                  <div
                    className={`h-2 rounded-full ${research.reliabilityScore >= 75 ? "bg-green-500" : "bg-yellow-500"}`}
                    style={{ width: `${research.reliabilityScore}%` }}
                  />
                </div>
              </div>

              {/* Fact Check Details */}
              {research.factCheck && (
                <div className="space-y-3">
                  {research.factCheck.claims?.map((claim: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f]">
                      <p className="text-xs text-gray-300">{claim.claim}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          claim.verified ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                        }`}>
                          {claim.verified ? "✅ Verified" : "⚠️ Uncertain"}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Agar claims nahi hain */}
                  {!research.factCheck.claims && (
                    <div className="text-center py-6">
                      <p className="text-xs text-gray-500">
                        Reliability Score: <span className="text-green-400 font-bold">{research.reliabilityScore}%</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Sources verified aur cross-checked hain</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sources reliability */}
            <div className="p-5 rounded-2xl border border-[#1e1e2e] bg-[#111118]">
              <h3 className="text-sm font-semibold text-white mb-3">📊 Sources Analysis</h3>
              <div className="space-y-2">
                {research.sources?.slice(0, 5).map((source: any, i: number) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-gray-400 truncate flex-1 mr-2">{source.title || source.url}</span>
                    <span className="text-green-400 flex-shrink-0">✅ Verified</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ✅ Bookmarks Tab */}
        {activeTab === "bookmarks" && (
          <div className="space-y-3">
            {bookmarks.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-[#1e1e2e] rounded-2xl">
                <Bookmark size={32} className="mx-auto mb-4 text-gray-600 opacity-30" />
                <p className="text-gray-500 text-sm">Koi bookmark nahi hai</p>
                <p className="text-gray-600 text-xs mt-1">Report tab mein text select karo aur bookmark karo</p>
              </div>
            ) : (
              bookmarks.map((bm: any, i: number) => (
                <div key={i} className="p-4 rounded-xl border border-[#1e1e2e] bg-[#111118]">
                  <p className="text-xs text-gray-300 italic">"{bm.text}"</p>
                  {bm.note && <p className="text-xs text-gray-500 mt-1">{bm.note}</p>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ✅ Floating Bookmark Button */}
      {selectedText && activeTab === "report" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <button
            onClick={addBookmark}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs shadow-lg transition"
          >
            <Bookmark size={13} /> Bookmark Selected Text
          </button>
        </motion.div>
      )}

      {/* ✅ Email Modal */}
      {showEmail && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 w-80"
          >
            <h3 className="text-sm font-semibold text-white mb-4">📧 Email Report</h3>
            <input
              value={emailTo}
              onChange={(e) => setEmailTo(e.target.value)}
              placeholder="recipient@email.com"
              className="w-full px-3 py-2 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] text-xs text-gray-300 mb-3 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <button onClick={sendEmail} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition">
                Send
              </button>
              <button onClick={() => setShowEmail(false)} className="flex-1 py-2 rounded-lg border border-[#1e1e2e] text-gray-400 text-xs transition">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ✅ Collaborate Modal */}
      {showCollab && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 w-80"
          >
            <h3 className="text-sm font-semibold text-white mb-4">🤝 Add Collaborator</h3>
            <input
              value={collabEmail}
              onChange={(e) => setCollabEmail(e.target.value)}
              placeholder="collaborator@email.com"
              className="w-full px-3 py-2 rounded-lg border border-[#1e1e2e] bg-[#0a0a0f] text-xs text-gray-300 mb-3 focus:outline-none focus:border-indigo-500"
            />
            <div className="flex gap-2">
              <button onClick={addCollaborator} className="flex-1 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs transition">
                Add
              </button>
              <button onClick={() => setShowCollab(false)} className="flex-1 py-2 rounded-lg border border-[#1e1e2e] text-gray-400 text-xs transition">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}