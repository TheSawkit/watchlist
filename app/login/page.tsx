import { LoginForm } from "@/components/auth/LoginForm"
import CinemaSpotlight from "@/components/ui/cinema-spotlight"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <CinemaSpotlight />
        <LoginForm />
      </div>
    </div>
  )
}
