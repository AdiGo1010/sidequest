import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { SupportChat } from "@/components/support-chat";
import "./globals.css";

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "SideQuest — start your first Side Quest",
  description:
    "A marketplace for Australian uni students: flexible freelance work around study, lower fees, equipment rental, and adult pay from $40+.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} h-full antialiased`}>
      <body className={`${nunito.className} sq-mesh relative flex min-h-full flex-col overflow-x-hidden`}>
        <SiteNav />
        <main className="relative z-10 flex w-full flex-1 flex-col">{children}</main>
        <SiteFooter />
        <SupportChat />
      </body>
    </html>
  );
}
