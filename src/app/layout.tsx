import type { Metadata } from "next";
import { Barlow_Condensed, Roboto } from "next/font/google";
import "./globals.css";
import { Navbar } from "../components/Navbar"; 
import { Footer } from "../components/Footer";

const barlow = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-barlow",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Futebol de Mesa - Sport Club do Recife",
  description: "Sistema oficial do Sport Futmesa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${barlow.variable} ${roboto.variable} font-sans`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </div>
      </body>
    </html>
  );
}