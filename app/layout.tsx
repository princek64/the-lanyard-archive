import type { Metadata } from "next";
import { archiveTitle } from "../lib/badges";
import "./globals.css";

export const metadata: Metadata = {
  title: archiveTitle,
  description: "A personal collection of conference badges and lanyards gathered across London.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body>{children}</body></html>;
}
