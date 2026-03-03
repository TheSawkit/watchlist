import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getTranslations } from "@/lib/i18n/server"

export default async function AuthErrorPage() {
  const t = await getTranslations()

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 text-center">
      <h1 className="mb-4 font-display text-4xl font-normal text-text md:text-5xl">
        {t.auth.errors.authentication}
      </h1>
      <p className="mb-8 max-w-md text-lg text-muted">
        {t.auth.errors.description}
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/login">{t.auth.errors.retry}</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">{t.auth.errors.backHome}</Link>
        </Button>
      </div>
    </div>
  )
}
