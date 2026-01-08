import Link from "next/link";
import CinemaSpotlight from "@/components/ui/cinema-spotlight";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative px-6 py-20 md:py-32 lg:px-12 overflow-hidden">
      <CinemaSpotlight position="top-0" />
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="mb-6 font-display text-6xl font-normal tracking-tight text-text md:text-8xl lg:text-9xl">
          ReelMark
        </h1>
        <p className="mb-4 text-xl text-muted md:text-2xl">
          Votre compagnon personnel pour suivre et organiser
        </p>
        <p className="mb-12 text-2xl font-semibold text-text md:text-4xl">
          tous les films, séries et contenus que vous avez déjà vus
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild className="px-8 py-4 text-lg">
            <Link href="/signup">Créer un compte</Link>
          </Button>
          <Button asChild variant="outline" className="px-8 py-4 text-lg">
            <Link href="/login">Se connecter</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

