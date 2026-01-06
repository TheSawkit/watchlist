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
          <a
            href="/signup"
            className="rounded-(--radius-cinema) bg-red-2 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-red"
          >
            Créer un compte gratuitement
          </a>
          <a
            href="/login"
            className="rounded-(--radius-cinema) border border-border bg-surface px-8 py-4 text-lg font-semibold text-text transition-all hover:bg-surface-2"
          >
            J&apos;ai déjà un compte
          </a>
        </div>
      </div>
    </section>
  );
}

