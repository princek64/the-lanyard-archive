import type { Metadata } from "next";
import localFont from "next/font/local";
import { archiveTitle } from "../lib/badges";
import "./globals.css";

const exhibitionDisplay = localFont({
  src: [
    { path: "./fonts/stix-two-text-regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/stix-two-text-italic.woff2", weight: "400", style: "italic" },
  ],
  display: "swap",
  variable: "--archive-display",
});

const archiveTitleFace = localFont({
  src: "./fonts/bricolage-latin.woff2",
  weight: "400 800",
  display: "swap",
  variable: "--archive-title",
});

export const metadata: Metadata = {
  title: archiveTitle,
  description: "A personal collection of conference badges and lanyards gathered across London.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en-GB"><body className={`${exhibitionDisplay.variable} ${archiveTitleFace.variable}`}>{children}</body></html>;
}
