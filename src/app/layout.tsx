import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PHP Compiler - Online PHP IDE & Runner',
  description:
    'Full-featured, mobile-responsive online PHP compiler and playground. Write mixed PHP, HTML, CSS, and JavaScript with Monaco editor, multi-file virtual tabs, instant live preview, and syntax completion.',
  keywords: [
    'PHP compiler',
    'online PHP IDE',
    'PHP playground',
    'PHP runner',
    'Next.js PHP compiler',
    'Eternity Global Innovation',
    'devfahimbd',
  ],
  authors: [{ name: 'Fahim Ahmed' }],
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
