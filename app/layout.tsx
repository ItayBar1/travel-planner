import type { Metadata } from "next";
import { Noto_Serif, Plus_Jakarta_Sans, Manrope } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/AppShell";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "מתכנן הטיול",
  description: "תכנון טיול לדרום-מזרח אסיה",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${notoSerif.variable} ${plusJakarta.variable} ${manrope.variable} h-full dark`}
    >
      <body className="min-h-full bg-[var(--color-background)] text-[var(--color-on-surface)]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
