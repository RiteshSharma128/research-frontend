"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { GitBranch } from "lucide-react";
import toast from "react-hot-toast";

export default function ResearchGraph() {
  const { api } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graphData, setGraphData] = useState<any>({ nodes: [], edges: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraph();
  }, []);

  useEffect(() => {
    if (graphData.nodes.length > 0) drawGraph();
  }, [graphData]);

  const fetchGraph = async () => {
    try {
      const { data } = await api.get("/research/graph");
      setGraphData(data);
    } catch {
      toast.error("Graph load nahi hui");
    } finally {
      setLoading(false);
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    // ✅ Position nodes in circle
    const nodePositions: Record<string, { x: number; y: number }> = {};
    const cx = W / 2, cy = H / 2;
    const radius = Math.min(W, H) * 0.35;

    graphData.nodes.forEach((node: any, i: number) => {
      const angle = (i / graphData.nodes.length) * Math.PI * 2;
      nodePositions[node.id] = {
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
      };
    });

    // ✅ Draw edges
    graphData.edges.forEach((edge: any) => {
      const from = nodePositions[edge.from];
      const to = nodePositions[edge.to];
      if (!from || !to) return;

      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = `rgba(99, 102, 241, ${Math.min(edge.weight * 0.2, 0.6)})`;
      ctx.lineWidth = edge.weight;
      ctx.stroke();
    });

    // ✅ Draw nodes
    graphData.nodes.forEach((node: any) => {
      const pos = nodePositions[node.id];
      if (!pos) return;

      // Node circle
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2);
      ctx.fillStyle = "#1e1e2e";
      ctx.fill();
      ctx.strokeStyle = "#6366f1";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Node label
      ctx.fillStyle = "#e5e7eb";
      ctx.font = "10px Arial";
      ctx.textAlign = "center";
      ctx.fillText(node.label.slice(0, 15), pos.x, pos.y + 35);
    });
  };

  return (
    <div className="p-5 rounded-xl border border-[#1e1e2e] bg-[#111118]">
      <div className="flex items-center gap-2 mb-4">
        <GitBranch size={16} className="text-indigo-400" />
        <h3 className="text-sm font-semibold text-white">🕸️ Research Graph</h3>
        <span className="text-xs text-gray-500">({graphData.nodes.length} topics)</span>
      </div>

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : graphData.nodes.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-gray-600">
          <div className="text-center">
            <GitBranch size={28} className="mx-auto mb-2 opacity-20" />
            <p className="text-sm">Research karo toh graph dikhega</p>
          </div>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={600}
          height={350}
          className="w-full rounded-lg bg-[#0a0a0f]"
        />
      )}
    </div>
  );
}