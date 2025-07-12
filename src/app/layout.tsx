import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/layout/header';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { PageTransition } from '@/components/layout/page-transition';

export const metadata: Metadata = {
  title: 'Synapse',
  description: 'An application to offer your skills and exchange them with other users.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{colorScheme: 'dark'}} suppressHydrationWarning>
      <head>
      </head>
      <body className="font-body antialiased">
        <AnimatedBackground />
        <div className="relative z-10 flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <PageTransition>
              {children}
            </PageTransition>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
