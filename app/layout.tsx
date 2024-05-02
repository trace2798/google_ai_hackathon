import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ModalProvider } from "@/components/modal-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { MobileHeader } from "@/components/navbar/mobile-header";
import { Sidebar } from "@/components/navbar/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kenniscentrum",
  description: "Kenniscentrum: Where knowledge begins",
  metadataBase: new URL("https://googleaihackathon-production.up.railway.app"),
  openGraph: {
    title: "Kenniscentrum: Where knowledge begins",
    description: "A fullstack web application for Google AI Hackathon",
    url: "https://googleaihackathon-production.up.railway.app",
    siteName: "googleaihackathon-production.up.railway.app",
    images: ["https://googleaihackathon-production.up.railway.app/og.png"],
  },
  twitter: {
    title: "Kenniscentrum: Where knowledge begins",
    card: "summary_large_image",
    images: ["https://googleaihackathon-production.up.railway.app/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: `https://googleaihackathon-production.up.railway.app/site.webmanifest`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ModalProvider />
            <Toaster />
            <div className="lg:hidden">
              <MobileHeader />
            </div>
            <Sidebar className="hidden lg:flex" />
            <main className="lg:pl-[256px] h-full pt-[50px] lg:pt-0">
              <div className="max-w-[1056px] mx-[5vw] lg:mx-auto pt-6 h-full">
                {children}
              </div>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
