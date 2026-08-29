import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import SupportChatWidget from "@/components/SupportChatWidget";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SideQuest — earn money doing what you're good at",
  description:
    "Student-first freelance marketplace for Australian uni students. Find gigs, post tasks, rent equipment.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="sq-mesh relative flex min-h-full flex-col overflow-x-hidden">
        <SiteNav />
        <main className="relative z-10 flex w-full flex-1 flex-col">{children}</main>
        <SiteFooter />
        <SupportChatWidget />
      </body>
    </html>
  );
}