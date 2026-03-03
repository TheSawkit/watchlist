"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import type { User } from "@supabase/supabase-js"

/**
 * Vérifie que l'utilisateur est authentifié.
 * Redirige vers /login sinon.
 * Retourne le user authentifié — jamais null.
 */
export async function requireAuth(): Promise<User> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    return user
}
