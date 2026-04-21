// "use client";
// import { ExternalLink, Globe } from "lucide-react";

// interface Source {
//   title: string;
//   url: string;
//   content?: string;
// }

// export default function SourceCard({ source, index }: { source: Source; index: number }) {
//   return (
//     <div className="p-3 rounded-xl border border-[#1e1e2e] hover:border-indigo-500/30 transition">
//       <div className="flex items-start justify-between gap-2">
//         <div className="flex items-center gap-2 min-w-0">
//           <span className="text-xs text-indigo-400 font-bold flex-shrink-0">[{index + 1}]</span>
//           <Globe size={12} className="text-gray-500 flex-shrink-0" />
//           <p className="text-xs text-white font-medium truncate">{source.title}</p>
//         </div>
        
//           href={source.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex-shrink-0 text-gray-500 hover:text-indigo-400 transition"
//         >
//           <ExternalLink size={12} />
//         </a>
//       </div>
//       {source.content && (
//         <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{source.content}</p>
//       )}
//       <p className="text-xs text-indigo-400/60 mt-1 truncate">{source.url}</p>
//     </div>
//   );
// }





"use client";
import { ExternalLink, Globe } from "lucide-react";

interface Source {
  title: string;
  url: string;
  content?: string;
}

export default function SourceCard({ source, index }: { source: Source; index: number }) {
  return (
    <div className="p-3 rounded-xl border border-[#1e1e2e] hover:border-indigo-500/30 transition">
      <div className="flex items-start justify-between gap-2">
        
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-indigo-400 font-bold flex-shrink-0">
            [{index + 1}]
          </span>
          <Globe size={12} className="text-gray-500 flex-shrink-0" />
          <p className="text-xs text-white font-medium truncate">
            {source.title}
          </p>
        </div>

        {/* ✅ FIXED anchor tag */}
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-gray-500 hover:text-indigo-400 transition"
        >
          <ExternalLink size={12} />
        </a>

      </div>

      {source.content && (
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">
          {source.content}
        </p>
      )}

      <p className="text-xs text-indigo-400/60 mt-1 truncate">
        {source.url}
      </p>
    </div>
  );
}