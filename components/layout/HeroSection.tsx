import Link from "next/link";
import CinemaSpotlight from "@/components/ui/cinema-spotlight";
import { Button } from "@/components/ui/button";
import Title from "@/components/layout/Title";
import { getTranslations } from "@/lib/i18n/server";

export default async function HeroSection() {
    const t = await getTranslations();

    return (
        <section className="relative px-6 py-20 md:py-32 lg:px-12 overflow-hidden">
            <CinemaSpotlight position="top-0" />
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <h1
                    className="mb-6 font-display text-6xl font-normal tracking-tight text-text md:text-8xl lg:text-9xl"
                    style={{ animation: "slideUp 0.8s ease-out forwards", opacity: 0 }}
                >
                    <Title className="inline-block h-[1em] w-auto text-text" />
                </h1>
                <p
                    className="mb-4 text-xl text-muted md:text-2xl"
                    style={{ animation: "slideUp 0.8s ease-out forwards", animationDelay: "200ms", opacity: 0 }}
                >
                    {t.hero.subtitle}
                </p>
                <p
                    className="mb-12 text-2xl font-semibold text-text md:text-4xl"
                    style={{ animation: "slideUp 0.8s ease-out forwards", animationDelay: "400ms", opacity: 0 }}
                >
                    {t.hero.description}
                </p>
                <div
                    className="flex flex-col gap-4 sm:flex-row sm:justify-center"
                    style={{ animation: "slideUp 0.8s ease-out forwards", animationDelay: "600ms", opacity: 0 }}
                >
                    <Button
                        asChild
                        className="px-8 py-4 text-lg transform hover:scale-105 transition-transform duration-200"
                    >
                        <Link href="/signup">{t.hero.cta}</Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="px-8 py-4 text-lg transform hover:scale-105 transition-transform duration-200"
                    >
                        <Link href="/login">{t.hero.login}</Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
