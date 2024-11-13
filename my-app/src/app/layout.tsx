import Navbar from '@/components/Navbar/navbar';
import './globals.css';
import { Poppins } from 'next/font/google';
import Footer from '@/components/footer/footer';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata = {
  title: 'Send Food',
  description: 'El sabor del buen comer',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`font-sans`} style={{ fontFamily: poppins.style.fontFamily }}>
      <body >
        <Navbar />
          {children}
       
        <Footer />
      </body>
    </html>
  );
}
