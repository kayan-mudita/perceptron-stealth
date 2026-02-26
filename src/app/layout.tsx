import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Official AI — Your AI Marketing Teammate",
  description:
    "Create AI-powered video content with your face and voice using Kling 2.6 and Seedance 2.0. No filming required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#060911] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
