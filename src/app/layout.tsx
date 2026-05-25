import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RR Artes | Hortolândia - Papelaria, Bordados e Consertos",
  description: "Compre materiais de papelaria criativa e variedades online ou solicite orçamento para bordados personalizados e consertos de roupas de alta qualidade em Hortolândia.",
  icons: {
    icon: "/Logo RR Artes.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased selection:bg-purple-500 selection:text-white">
          <Providers>
            <Navbar />
            <main className="flex-grow flex flex-col">{children}</main>
            <Footer />
            <WhatsAppButton />
          </Providers>
      </body>
    </html>
  );
}
