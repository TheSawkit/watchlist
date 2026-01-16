import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: "🎬",
    title: "Suivi complet",
    description:
      "Enregistrez tous les films et séries que vous avez vus en un seul endroit. Ne perdez plus jamais le fil de votre parcours cinématographique.",
  },
  {
    icon: "📊",
    title: "Statistiques détaillées",
    description:
      "Visualisez vos habitudes de visionnage, découvrez vos genres préférés et explorez votre historique de manière interactive.",
  },
  {
    icon: "🔍",
    title: "Recherche rapide",
    description:
      "Trouvez instantanément ce que vous avez déjà regardé grâce à notre moteur de recherche puissant et intuitif.",
  },
  {
    icon: "⭐",
    title: "Notes et avis",
    description:
      "Ajoutez vos propres notes et évaluations à chaque contenu pour vous souvenir de ce que vous avez pensé.",
  },
  {
    icon: "📱",
    title: "Accessible partout",
    description:
      "Accédez à votre bibliothèque depuis n'importe quel appareil, que ce soit sur votre ordinateur, tablette ou smartphone.",
  },
  {
    icon: "🎯",
    title: "Recommandations",
    description:
      "Découvrez de nouveaux contenus basés sur ce que vous avez déjà aimé et explorez des suggestions personnalisées.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <h2
          className="mb-12 text-center font-display text-5xl font-normal text-text md:text-6xl"
          style={{
            animation: "slideUp 0.6s ease-out forwards",
            opacity: 0,
          }}
        >
          Pourquoi ReelMark ?
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                animation: `fadeIn 0.6s ease-out forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0,
              }}
            >
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

