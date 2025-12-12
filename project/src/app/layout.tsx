import './styles.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Inter, Playfair_Display } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['700', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'BioFit 3D - A New Dawn',
  description: 'A legacy reimagined through precision 3D biometrics',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} bg-white text-gray-900 dark:bg-background-dark dark:text-white transition-colors duration-300`}>
        <div className="relative flex min-h-screen w-full flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
