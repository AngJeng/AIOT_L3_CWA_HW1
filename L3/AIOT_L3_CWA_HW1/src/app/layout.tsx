import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "台灣氣象儀表板 | Taiwan Weather Dashboard",
  description: "整合中央氣象署 Open Data API 與 SQLite 的台灣即時氣候觀測與預報系統",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="h-full bg-slate-50">
      <body className="flex flex-col min-h-screen text-slate-800 antialiased font-sans">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-slate-900 hover:text-blue-600 transition">
              <span className="text-2xl">🌦️</span>
              <span className="tracking-tight">台灣氣象儀表板</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-semibold hidden sm:inline-block">
                CWA O-A0003-001
              </span>
            </Link>

            <nav className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
              >
                首頁總覽
              </Link>
              <Link
                href="/forecast"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
              >
                區域趨勢
              </Link>
              <Link
                href="/stations"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
              >
                測站地圖
              </Link>
              <Link
                href="/about"
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition"
              >
                關於系統
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-auto py-6">
          <div className="container mx-auto px-4 text-center text-xs text-slate-500 space-y-1">
            <p>
              資料來源：中央氣象署 (CWA) 開放資料平台 • 氣象觀測站-10分鐘綜觀氣象資料 (O-A0003-001)
            </p>
            <p>
              © {new Date().getFullYear()} Taiwan Weather Dashboard • Next.js & Tailwind CSS
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
