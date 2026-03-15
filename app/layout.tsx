import type { Metadata } from "next";
import { Inter, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import CinemaSpotlight from "@/components/ui/cinema-spotlight";
import { Providers } from "./providers";
import { getServerLanguage, getTranslations } from "@/lib/i18n/server";

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
    const t = await getTranslations();

    return (
        <html lang={lang} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var t=localStorage.getItem("theme");if(t==="light")document.documentElement.classList.add("light");else if(t==="system"){if(window.matchMedia("(prefers-color-scheme: light)").matches)document.documentElement.classList.add("light")}else{document.documentElement.classList.add("dark")}}catch(e){}})()`,
                    }}
                />
            </head>
            <body className={`${sans.variable} ${display.variable} antialiased bg-app-bg text-text-main`}>
                <Providers initialLang={lang}>
                    <a
                        href="#main-content"
                        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg"
                    >
                        {t.common.skipToMainContent}
                    </a>
                    <Navbar />
                    <CinemaSpotlight />
                    <main id="main-content">
                        {children}
                    </main>
                </Providers>
            </body>
        </html>
    );
}
