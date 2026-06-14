import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { TimezoneProvider } from '@/providers/TimezoneProvider';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 | Live Scores & Updates',
  description:
    'Real-time FIFA World Cup 2026 scores, match schedules, group standings, knockout brackets, and tournament statistics.',
  keywords: ['FIFA World Cup 2026', 'live scores', 'football', 'soccer', 'tournament'],
  manifest: '/manifest.json',
  icons: { icon: '/favicon.ico', apple: '/apple-touch-icon.png' },
  openGraph: {
    title: 'FIFA World Cup 2026 Live',
    description: 'Real-time World Cup 2026 scores and tournament information',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#060B18',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-stadium-800 text-white antialiased">
        <QueryProvider>
          <TimezoneProvider>
            <div className="flex h-screen overflow-hidden">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                  {children}
                </main>
              </div>
            </div>
          </TimezoneProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
