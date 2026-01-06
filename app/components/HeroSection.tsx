export default function HeroSection() {
  return (
    <section className="relative px-6 py-20 md:py-32 lg:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="mb-6 font-display text-6xl font-normal tracking-tight text-text md:text-8xl lg:text-9xl">
          SeenIt
        </h1>
        <p className="mb-4 text-xl text-muted md:text-2xl">
          Votre compagnon personnel pour suivre et organiser
        </p>
        <p className="mb-12 text-2xl font-semibold text-text md:text-4xl">
          tous les films, séries et contenus que vous avez déjà vus
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <a
            href="/signup"
            className="rounded-(--radius-cinema) bg-red px-8 py-4 text-lg font-semibold text-white transition-all hover:shadow-cinema hover:bg-red-2"
          >
            Créer un compte
          </a>
          <a
            href="/login"
            className="rounded-(--radius-cinema) border border-border bg-surface px-8 py-4 text-lg font-semibold text-text transition-all hover:bg-surface-2"
          >
            Se connecter
          </a>
        </div>
      </div>
    </section>
  );
}

