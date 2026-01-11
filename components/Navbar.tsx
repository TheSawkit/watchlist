import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { signout } from "@/app/auth/actions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings } from "lucide-react";

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
            <div className="items-center justify-center gap-8 md:flex hidden">
              <Link
                href="/"
                className="text-muted transition-colors hover:text-text"
              >
                Accueil
              </Link>
              <Link
                href="/explorer"
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
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-full overflow-hidden">
                      <Image
                        src={user.user_metadata.picture?
                          user.user_metadata.picture:
                          `https://api.dicebear.com/9.x/initials/svg?seed=${user.user_metadata.full_name?
                            user.user_metadata.full_name:
                            user.user_metadata.email.split('@')[0]}&size=128&backgroundType=gradientLinear&backgroundColor=d97706&fontWeight=600&fontFamily=Tahoma&chars=1`}
                        alt="User avatar"
                        width={128}
                        height={128}
                        className="object-cover"
                        unoptimized
                      />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.user_metadata.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Paramètres</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <form action={signout} className="w-full">
                        <button type="submit" className="flex w-full items-center text-red-500 hover:text-red-600">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Déconnexion</span>
                        </button>
                      </form>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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
