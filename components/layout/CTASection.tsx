import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-4xl rounded-(--radius-cinema) bg-surface-2 p-12 text-center shadow-cinema">
        <h2 className="mb-6 font-display text-4xl font-normal text-text md:text-5xl">
          Prêt à commencer ?
        </h2>
        <p className="mb-8 text-lg text-muted md:text-xl">
          Rejoignez la communauté de cinéphiles qui gardent une trace de leur
          parcours cinématographique.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild className="px-8 py-4 text-lg transform hover:scale-105 active:scale-95 transition-transform duration-200">
            <Link href="/signup">Créer un compte gratuitement</Link>
          </Button>
          <Button asChild variant="outline" className="px-8 py-4 text-lg transform hover:scale-105 active:scale-95 transition-transform duration-200">
            <Link href="/login">J&apos;ai déjà un compte</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

