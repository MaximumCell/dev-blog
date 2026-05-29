import type { Metadata } from "next";
import { Caveat, Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "My Learning Blog",
  description: "A personal blog where I write about things I'm learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col bg-[#FAFAFA] text-zinc-900">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
