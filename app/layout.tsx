import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import CinemaSpotlight from "@/components/ui/cinema-spotlight";
import { Providers } from "./providers";
import { getServerLanguage } from "@/lib/i18n/server";

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
    description:
        "Your personal companion to track and organize all the movies, shows and content you have already watched.",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const lang = await getServerLanguage();

    return (
        <html lang={lang}>
            <body className={`${sans.variable} ${display.variable} antialiased bg-app-bg text-text-main`}>
                <Providers initialLang={lang}>
                    <Navbar />
                    <CinemaSpotlight />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
