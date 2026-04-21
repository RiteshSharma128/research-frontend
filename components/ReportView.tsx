"use client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";

interface ReportViewProps {
  report: string;
  streaming?: boolean;
}

export default function ReportView({ report, streaming }: ReportViewProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="prose prose-invert prose-sm max-w-none"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold text-white border-b border-[#1e1e2e] pb-2 mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold text-white mt-6 mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold text-gray-200 mt-4 mb-2">{children}</h3>
          ),
          p: ({ children }) => (
            <p className="text-gray-300 leading-relaxed mb-3 text-sm">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 mb-3 text-gray-300 text-sm">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1 mb-3 text-gray-300 text-sm">{children}</ol>
          ),
          li: ({ children }) => <li className="text-gray-300 text-sm">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-gray-400 my-3">{children}</blockquote>
          ),
          code: ({ children }) => (
            <code className="bg-[#1e1e2e] px-1.5 py-0.5 rounded text-xs text-cyan-300 font-mono">{children}</code>
          ),
          strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline">
              {children}
            </a>
          ),
        }}
      >
        {report}
      </ReactMarkdown>
      {streaming && (
        <span className="inline-block w-2 h-4 bg-indigo-500 ml-1 animate-pulse" />
      )}
    </motion.div>
  );
}