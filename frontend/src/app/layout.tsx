import type { Metadata } from "next";
import "./globals.css";
import AgentWidget from "@/components/agent/AgentWidget";

export const metadata: Metadata = {
  title: "AthleteIQ",
  description: "NBA Intelligence Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AgentWidget />
      </body>
    </html>
  );
}
