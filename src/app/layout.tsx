import type { Metadata } from "next";
import { Space_Grotesk, Work_Sans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

import ThemeToggle from "../components/ThemeToggle";
import ScrollToTop from "../components/ScrollToTop";

export const metadata: Metadata = {
  title: "CampusOne | One Front Door for Everything",
  description: "Ask once. Get routed correctly. Get a grounded answer.",
};

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

import Providers from "../components/Providers";
import LogoutButton from "../components/LogoutButton";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions) as any;
  const role = session?.user?.role;

  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${workSans.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-work-sans)" }}
      >
        <Providers>
          <div className="flex flex-col min-h-screen bg-background text-foreground transition-colors duration-300">
          <nav className="w-full border-b-[1px] border-border bg-background py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50 transition-colors duration-300">
            <Link href="/" className="text-xl font-bold uppercase tracking-widest text-primary hover:opacity-80 transition-opacity" style={{ fontFamily: "var(--font-space-grotesk)" }}>
              Bennett University
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-semibold tracking-wide">
              <Link href="/#legacy" className="hover:text-primary transition-colors">Legacy & Leadership</Link>
              <Link href="/explore" className="hover:text-primary transition-colors">Explore Campus</Link>
              <Link href="/lost-found" className="hover:text-primary transition-colors">AI Matchmaker</Link>
              <Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link>
              <Link href="/gigs" className="hover:text-primary transition-colors">Active Gigs</Link>
              <Link href="/map" className="hover:text-primary transition-colors">Campus Maps</Link>
              <div className="h-6 w-px bg-border mx-2"></div>
              
              {!session ? (
                <Link href="/login" className="border-[1px] border-gray-400 text-gray-400 px-4 py-1.5 hover:bg-gray-400 hover:text-black transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                  Login
                </Link>
              ) : role === 'ADMIN' ? (
                <Link href="/admin" className="border-[1px] border-primary text-primary px-4 py-1.5 hover:bg-primary hover:text-black transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  Admin Portal
                </Link>
              ) : (
                <Link href="/profile" className="border-[1px] border-orange-500 text-orange-500 px-4 py-1.5 hover:bg-orange-500 hover:text-black transition-colors flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                  Student Profile
                </Link>
              )}
              {session && <LogoutButton />}
              <ThemeToggle />
            </div>
          </nav>
          <main className="flex-grow">
            {children}
          </main>
          <footer className="w-full border-t-[1px] border-border bg-background py-8 px-6 md:px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-gray-500">
            <div>© 2026 CampusOne Orchestration.</div>
            <div className="flex gap-6">
              <a href="/tos" className="hover:text-primary">Terms of Service</a>
              <a href="/privacy" className="hover:text-primary">Privacy Policy</a>
            </div>
          </footer>
        </div>
        <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}
