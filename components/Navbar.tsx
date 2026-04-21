// // research-assistant/components/Navbar.tsx
// "use client";
// import { useRouter, usePathname } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import {
//   Brain, Plus, History, LayoutDashboard,
//   LogOut, GitCompare, Clock
// } from "lucide-react";

// export default function Navbar() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, logout } = useAuth();

//   // Auth pages pe navbar mat dikhao
//   if (pathname?.startsWith("/auth") || pathname === "/") return null;

//   const navItems = [
//     { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
//     { path: "/research", label: "New Research", icon: <Plus size={15} /> },
//     { path: "/history", label: "History", icon: <History size={15} /> },
//     { path: "/compare", label: "Compare", icon: <GitCompare size={15} /> },
//   ];

//   return (
//     <nav className="border-b border-[#1e1e2e] px-6 py-3 flex items-center justify-between bg-[#0a0a0f] sticky top-0 z-50">
//       {/* Logo */}
//       <div
//         className="flex items-center gap-2 cursor-pointer"
//         onClick={() => router.push("/dashboard")}
//       >
//         <Brain size={18} className="text-indigo-400" />
//         <span className="font-bold text-white text-sm">ResearchAI</span>
//       </div>

//       {/* Nav Links */}
//       <div className="flex items-center gap-1">
//         {navItems.map((item) => (
//           <button
//             key={item.path}
//             onClick={() => router.push(item.path)}
//             className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
//               pathname === item.path
//                 ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
//                 : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
//             }`}
//           >
//             {item.icon}
//             {item.label}
//           </button>
//         ))}
//       </div>

//       {/* User */}
//       <div className="flex items-center gap-3">
//         {user && (
//           <span className="text-xs text-gray-500">Hey, {user.name} 👋</span>
//         )}
//         <button
//           onClick={() => { logout(); router.push("/"); }}
//           className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 transition"
//         >
//           <LogOut size={14} />
//         </button>
//       </div>
//     </nav>
//   );
// }




"use client";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Brain, Plus, History, LayoutDashboard, LogOut, GitCompare } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname?.startsWith("/auth") || pathname === "/") return null;

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={14} /> },
    { path: "/research", label: "New Research", icon: <Plus size={14} /> },
    { path: "/history", label: "History", icon: <History size={14} /> },
    { path: "/compare", label: "Compare", icon: <GitCompare size={14} /> },
  ];

  return (
    <nav className="border-b border-[#1e1e2e] px-6 py-3 flex items-center justify-between bg-[#0a0a0f] sticky top-0 z-40">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/dashboard")}>
        <Brain size={18} className="text-indigo-400" />
        <span className="font-bold text-white text-sm">ResearchAI</span>
      </div>

      <div className="flex items-center gap-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => router.push(item.path)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition ${
              pathname === item.path
                ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        {user && <span className="text-xs text-gray-500">Hey, {user.name} 👋</span>}
        <button
          onClick={() => { logout(); router.push("/"); }}
          className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-red-400 transition"
        >
          <LogOut size={14} />
        </button>
      </div>
    </nav>
  );
}