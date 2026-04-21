




// import type { Metadata } from "next";
// import { Inter } from "next/font/google";
// import "./globals.css";
// import { Toaster } from "react-hot-toast";
// import { AuthProvider } from "@/context/AuthContext";
// import Navbar from "@/components/Navbar";

// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "AI Research Assistant",
//   description: "Multi-Agent AI powered research tool",
//   viewport: "width=device-width, initial-scale=1, maximum-scale=1",
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} bg-[#0a0a0f] text-white`}>
//         <AuthProvider>
//           {children}

//           <Toaster
//             position="top-right"
//             toastOptions={{
//               style: {
//                 background: "#111118",
//                 color: "#fff",
//                 border: "1px solid #1e1e2e",
//               },
//             }}
//           />
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }




import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResearchAI",
  description: "AI powered research assistant",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0a0a0f]`}>
        <AuthProvider>
          <Toaster position="top-right" />
          <Navbar />  {/* ✅ Har page pe dikhega */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}