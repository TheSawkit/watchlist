import type { Metadata } from "next"
import { SignupForm } from "@/components/auth/SignupForm"
import CinemaSpotlight from "@/components/ui/cinema-spotlight"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { getTranslations } from "@/lib/i18n/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()

  return {
    title: t.metadata.signupTitle,
    description: t.metadata.signupDescription,
    openGraph: {
      title: t.metadata.signupTitle,
      description: t.metadata.signupDescription,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: t.metadata.signupTitle,
      description: t.metadata.signupDescription,
    },
  }
}

export default async function SignupPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <CinemaSpotlight />
        <SignupForm />
      </div>
    </div>
  )
}
