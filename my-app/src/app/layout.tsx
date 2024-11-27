// app/layout.tsx

"use client";  // Esto marca el archivo como un componente de cliente

import Navbar from '@/components/Navbar/navbar';
import './globals.css';
import { Baskervville } from 'next/font/google';
import Footer from '@/components/footer/footer';
import { ClerkProvider } from '@clerk/nextjs';

import { Provider } from 'react-redux'; // Importa el Provider de Redux
import store from '@/redux/store/store';  // Importa el store de Redux

const baskerville = Baskervville({ 
  weight: ['400'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-baskerville',
});



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>

      <Provider store={store}>
        <html lang="es" className={`${baskerville.variable} font-serif`}>
          <body className={baskerville.className}>
           
              <Navbar />
              <main>{children}</main>
              <Footer />
           
          </body>
        </html>
      </Provider>
    </ClerkProvider>
  );
}
