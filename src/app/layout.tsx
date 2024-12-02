"use client";

import Navbar from "@/components/Navbar/navbar";
import "./globals.css";
import { Baskervville } from "next/font/google";
import Footer from "@/components/footer/footer";
import { ClerkProvider } from "@clerk/nextjs";

import { Provider } from "react-redux";
import store, { persistor } from "@/redux/store/store";
import { PersistGate } from "redux-persist/integration/react";

const baskerville = Baskervville({
  weight: ["400"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-baskerville",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <html lang="es" className={`${baskerville.variable} font-serif h-full`}>
            <body className={`${baskerville.className} h-full overflow-y-auto`}>
              <Navbar />
              <main className="min-h-screen">{children}</main>
             <Footer/>
            </body>
          </html>
        </PersistGate>
      </Provider>
    </ClerkProvider>
  );
}
