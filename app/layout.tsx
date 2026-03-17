import type { Metadata, Viewport } from "next";
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

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://reelmark.app"

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: dark)", color: "#000000" },
        { media: "(prefers-color-scheme: light)", color: "#F5F5F7" },
    ],
}

export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: "ReelMark — Track Movies & TV Shows",
        template: "%s | ReelMark",
    },
    description:
        "Your personal companion to track and organize all the movies, shows and content you have already watched.",
    applicationName: "ReelMark",
    keywords: ["watchlist", "movies", "tv shows", "tracker", "cinema", "films", "series"],
    authors: [{ name: "SAWKIT" }],
    creator: "SAWKIT",
    openGraph: {
        type: "website",
        siteName: "ReelMark",
        locale: "en_US",
    },
    twitter: {
        card: "summary_large_image",
    },
    icons: {
        icon: "/maskable_icon_x192.png",
        apple: "/maskable_icon_x192.png",
    },
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
                <link rel="dns-prefetch" href="https://image.tmdb.org" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(){try{var h=document.documentElement,t=localStorage.getItem("theme"),m=window.matchMedia("(prefers-color-scheme: light)");function a(l){h.classList.remove("light","dark");h.classList.add(l?"light":"dark")}if(t==="light")a(true);else if(t==="dark")a(false);else{a(m.matches);m.addEventListener("change",function(e){var s=localStorage.getItem("theme");if(!s||s==="system")a(e.matches)})}}catch(e){}})()`,
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
                    <main id="main-content" className="pt-12">
                        {children}
                    </main>
                    <footer className="border-t border-border-subtle mt-auto py-8 text-center text-sm text-muted">
                        <p>© {new Date().getFullYear()} ReelMark</p>
                    </footer>
                </Providers>
            </body>
        </html>
    );
}
