import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KrispLabs — Small, sharp software",
  description:
    "KrispLabs is the studio behind Kiosk, iDo, Kiosk Scholar, NutriScan, and Soura — local-first tools built by Sarthak Ghosh."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
