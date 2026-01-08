import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CinemaSpotlight from "@/components/ui/cinema-spotlight"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <CinemaSpotlight />
      <h1 className="text-3xl font-display font-bold mb-6">Tableau de bord</h1>
      <Card>
        <CardHeader>
          <CardTitle>Bienvenue, {user.user_metadata.full_name || user.email} !</CardTitle>
          <CardDescription>
            Vous êtes maintenant connecté.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted">
            C&apos;est ici que vous retrouverez votre watchlist et vos statistiques.
          </p>
        </CardContent>
      </Card>
    </div>
    // TODO: Add watchlist and statistics
  )
}

