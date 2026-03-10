import { createClient } from "@/lib/supabase/server"

export async function getAuthenticatedUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error("Non authentifié")

    return { supabase, userId: user.id }
}

export async function getOptionalUser() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    return { supabase, userId: user?.id ?? null }
}
