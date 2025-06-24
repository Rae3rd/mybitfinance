import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import ReactQueryProvider from './providers/ReactQueryProvider';
import Header from './components/Header';
import Footer from './components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MyBitFinance - Cryptocurrency Investment Platform',
  description: 'Invest in cryptocurrencies with MyBitFinance. Buy, sell, and manage your digital assets with our secure platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={inter.className}>
          <ReactQueryProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </ReactQueryProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
