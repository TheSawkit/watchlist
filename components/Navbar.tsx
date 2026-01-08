import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/auth/actions";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="grid grid-cols-3 h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="font-display text-2xl font-normal text-text">
              ReelMark
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          {user ? (
            <div className="items-center justify-center gap-8 md:flex">
              <Link
                href="/"
                className="text-muted transition-colors hover:text-text"
              >
                Accueil
              </Link>
              <Link
                href="/explore"
                className="text-muted transition-colors hover:text-text"
              >
                Explorer
              </Link>
              <Link
                href="/library"
                className="text-muted transition-colors hover:text-text"
              >
                Ma bibliothèque
              </Link>
            </div>
          ) : (<div></div>)}

          {/* Auth Buttons */}
          <div className="flex items-center justify-end gap-4">
            {user ? (
              // TODO: Replace with dropdown menu with user settings and logout
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted hidden md:inline-block">
                  {user.user_metadata.full_name}
                </span>
                <form action={signout}>
                  <Button variant="outline" type="submit">
                    Déconnexion
                  </Button>
                </form>
              </div>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link href="/login">Connexion</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Inscription</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
