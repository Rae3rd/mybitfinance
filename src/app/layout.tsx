import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import QuickActionSidebar from './components/QuickActionSidebar';
import FloatingActionButton from './components/FloatingActionButton';
import ReactQueryProvider from './providers/ReactQueryProvider';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MyBitFinance - Investment Tracker",
  description: "Track and manage your stocks and crypto investments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
        >
          <ReactQueryProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
            <QuickActionSidebar />
            <FloatingActionButton />
          </ReactQueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
