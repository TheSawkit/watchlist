import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import CinemaSpotlight from "@/components/ui/cinema-spotlight";
import { ThemeProvider } from "./providers";

const sans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "ReelMark",
  description: "Votre compagnon personnel pour suivre et organiser tous les films, séries et contenus que vous avez déjà vus. Gardez une trace de votre parcours cinématographique et découvrez ce que vous avez manqué.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${sans.variable} ${display.variable} antialiased`}
      >
        <ThemeProvider>
          <Navbar />
          <CinemaSpotlight />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
