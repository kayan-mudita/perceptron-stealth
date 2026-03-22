"use client";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050508] overflow-hidden">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
