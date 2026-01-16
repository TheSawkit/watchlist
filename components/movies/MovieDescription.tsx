interface MovieDescriptionProps {
  description: string
  tagline?: string
}

export function MovieDescription({ description }: MovieDescriptionProps) {
  if (!description) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-2xl md:text-3xl font-bold text-text">Description</h2>
      <p className="text-lg text-muted leading-relaxed max-w-4xl">
        {description}
      </p>
    </section>
  )
}
