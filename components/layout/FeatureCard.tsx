import { Card, CardContent } from "@/components/ui/card";
import type { FeatureCardProps } from "@/types/components";

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="shadow-cinema transform transition-all duration-300 hover:scale-105 hover:shadow-lg group">
      <CardContent className="p-8">
        <div className="mb-4 text-4xl">{icon}</div>
        <h3 className="mb-3 font-display text-2xl font-normal text-text">
          {title}
        </h3>
        <p className="text-muted">{description}</p>
      </CardContent>
    </Card>
  );
}

