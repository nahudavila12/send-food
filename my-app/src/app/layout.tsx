
import Navbar from '@/components/Navbar/navbar';
import './globals.css';
import { Baskervville } from 'next/font/google';
import Footer from '@/components/footer/footer';
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const baskerville = Baskervville({ 
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-baskerville',
});

export const metadata = {
  title: 'Le Gourmet Exquis',
  description: 'El sabor del buen comer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="es" className={`${baskerville.variable} font-serif`}>
        <body className={baskerville.className}>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}