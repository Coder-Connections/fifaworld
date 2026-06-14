import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import { TimezoneProvider } from '@/providers/TimezoneProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import MobileNav from '@/components/layout/MobileNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FIFA World Cup 2026 | Live Scores & Updates',
  description: 'Real-time FIFA World Cup 2026 scores, match schedules, group standings, knockout brackets, and tournament statistics.',
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
    // Default to dark class so first paint is dark; ThemeProvider corrects on mount if light is saved
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-t-bg text-t-text antialiased">
        <ThemeProvider>
          <QueryProvider>
            <TimezoneProvider>
              <div className="flex h-screen overflow-hidden">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                  <Header />
                  {/* pb-20 on mobile to clear the fixed bottom nav */}
                  <main className="flex-1 overflow-y-auto p-4 pb-24 md:pb-6 lg:p-6">
                    {children}
                  </main>
                </div>
              </div>
              <MobileNav />
            </TimezoneProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
