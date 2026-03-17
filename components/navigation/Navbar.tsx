import Link from "next/link";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Title from "@/components/layout/Title";
import { getTranslations } from "@/lib/i18n/server";

const NavbarMobile = dynamic(() =>
    import("@/components/navigation/NavbarMobile").then(m => ({ default: m.NavbarMobile }))
);
const NavLinks = dynamic(() =>
    import("@/components/navigation/NavLinks").then(m => ({ default: m.NavLinks }))
);
const SignoutButton = dynamic(() =>
    import("@/components/auth/SignoutButton").then(m => ({ default: m.SignoutButton }))
);
const UserAvatar = dynamic(() =>
    import("@/components/shared/UserAvatar").then(m => ({ default: m.UserAvatar }))
);
const DropdownMenu = dynamic(() =>
    import("@/components/ui/dropdown-menu").then(m => ({ default: m.DropdownMenu }))
);
const DropdownMenuContent = dynamic(() =>
    import("@/components/ui/dropdown-menu").then(m => ({ default: m.DropdownMenuContent }))
);
const DropdownMenuItem = dynamic(() =>
    import("@/components/ui/dropdown-menu").then(m => ({ default: m.DropdownMenuItem }))
);
const DropdownMenuLabel = dynamic(() =>
    import("@/components/ui/dropdown-menu").then(m => ({ default: m.DropdownMenuLabel }))
);
const DropdownMenuSeparator = dynamic(() =>
    import("@/components/ui/dropdown-menu").then(m => ({ default: m.DropdownMenuSeparator }))
);
const DropdownMenuTrigger = dynamic(() =>
    import("@/components/ui/dropdown-menu").then(m => ({ default: m.DropdownMenuTrigger }))
);
const Settings = dynamic(() =>
    import("lucide-react").then(m => ({ default: m.Settings }))
);

/**
 * App navigation header with logo, links, and user menu.
 * Displays authenticated user avatar with dropdown menu, or login/signup buttons.
 * Responsive layout: mobile menu on small screens, horizontal links on desktop.
 *
 * @returns Navigation header with authentication-aware UI
 * @example
 * // Used as main app navbar in layout
 * <Navbar />
 */
export default async function Navbar() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const t = await getTranslations();

    return (
        <header>
            <nav className="fixed w-full top-0 z-50 border-b border-border-subtle bg-surface/30 backdrop-blur-3xl backdrop-saturate-150 shadow-navbar">
                <div className="mx-auto max-w-7xl px-6 lg:px-12">
                    <div className="grid grid-cols-3 h-16 items-center">
                    {user ? (
                        <div className="flex items-center md:hidden justify-start col-start-1">
                            <NavbarMobile
                                user={
                                    user as {
                                        user_metadata: { full_name?: string; username?: string; picture?: string; avatar_url?: string };
                                        email?: string;
                                    }
                                }
                            />
                        </div>
                    ) : null}

                    <div className="flex justify-center md:justify-start col-start-2 md:col-start-1">
                        <Link
                            href="/"
                            className="font-display text-2xl font-normal text-text-main transform transition-transform duration-(--duration-fast) hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-12 flex items-center"
                        >
                            <Title className="inline-block h-[0.7em] align-baseline mr-[0.03em] text-text" />
                        </Link>
                    </div>

                    {user ? (
                        <div className="hidden md:flex gap-8 justify-center col-start-2">
                            <NavLinks orientation="horizontal" />
                        </div>
                    ) : null}

                    <div className="hidden md:flex gap-4 justify-end col-start-3">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="icon-lg"
                                            aria-label={t.navbar.userMenu}
                                            className="rounded-full overflow-hidden border-2 border-transparent data-[state=open]:border-primary transition-all duration-(--duration-fast) focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-12 min-w-12"
                                        >
                                            <UserAvatar
                                                picture={user.user_metadata.avatar_url || user.user_metadata.picture}
                                                fullName={user.user_metadata.username || user.user_metadata.full_name}
                                                email={user.user_metadata.email}
                                                size={128}
                                                className="select-none"
                                            />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user.user_metadata.username || user.user_metadata.full_name}
                                                </p>
                                                <p className="text-xs leading-none text-text-muted">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href="/settings"
                                                className="cursor-pointer w-full flex items-center"
                                            >
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>{t.navbar.settings}</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem variant="destructive">
                                            <SignoutButton />
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <div className="flex gap-4 justify-end col-start-3">
                                <Button asChild variant="outline" className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-12 border-border text-muted hover:text-text hover:bg-surface-2 border">
                                    <Link href="/login">{t.navbar.login}</Link>
                                </Button>
                                <Button asChild className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none min-h-12 flex items-center bg-primary hover:bg-primary-hover text-white">
                                    <Link href="/signup">{t.navbar.signup}</Link>
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            </nav>
        </header>
    );
}
