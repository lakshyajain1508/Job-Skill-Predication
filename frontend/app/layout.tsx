import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "CareerPilot AI - Career Intelligence Platform",
  description: "AI-powered career guidance and job market analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-dark-950 text-white">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
