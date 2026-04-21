"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Brain, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Link from "next/link";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) { toast.error("Sab fields bharo!"); return; }
    if (password.length < 6) { toast.error("Password 6+ characters hona chahiye!"); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      toast.success("Account create ho gaya! 🎉");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Register failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4">
            <Brain size={22} className="text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Account banao</h1>
          <p className="text-gray-500 text-sm mt-1">Free mein start karo</p>
        </div>

        <div className="bg-[#111118] border border-[#1e1e2e] rounded-2xl p-6 space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400">Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tumhara naam"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-gray-400">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium text-sm transition flex items-center justify-center"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Create Account"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500">
            Already account hai?{" "}
            <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300">
              Login karo
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}