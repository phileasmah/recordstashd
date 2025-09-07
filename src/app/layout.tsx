import { Navbar } from "@/components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from '@clerk/themes';
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { Toaster } from "sonner";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RecordStashd",
  description: "Review and discover music",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <Providers>
        <html lang="en">
          <body
            className={`${geistSans.variable} ${geistMono.variable} flex min-h-screen flex-col antialiased`}
          >
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t border-zinc-800 py-6 text-sm text-zinc-400">
              <div className="container mx-auto px-4 flex items-center justify-between">
                <p>© {new Date().getFullYear()} RecordStashd</p>
                <div className="flex items-center gap-4">
                  <Link className="hover:underline" href="/terms">Terms</Link>
                  <Link className="hover:underline" href="/privacy">Privacy</Link>
                </div>
              </div>
            </footer>
            <Toaster />
          </body>
        </html>
      </Providers>
    </ClerkProvider>
  );
}
