interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-(--radius-cinema) bg-surface p-8 shadow-cinema">
      <div className="mb-4 text-4xl">{icon}</div>
      <h3 className="mb-3 font-display text-2xl font-normal text-text">
        {title}
      </h3>
      <p className="text-muted">{description}</p>
    </div>
  );
}

