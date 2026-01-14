import type { Metadata } from "next";
import { Barlow, Roboto } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-barlow",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Sport Club do Recife - Futebol de Mesa",
  description: "Sistema oficial do departamento de futebol de mesa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${barlow.variable} ${roboto.variable}`}>
      <body className="bg-[#0a0a0a] text-zinc-300 font-roboto antialiased flex flex-col min-h-screen">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
