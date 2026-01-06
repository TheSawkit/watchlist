import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-display text-2xl font-normal text-text">
            SeenIt
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden items-center gap-8 md:flex">
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

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="rounded-(--radius-cinema) border border-border bg-surface px-4 py-2 text-sm font-semibold text-text transition-all hover:bg-surface-2"
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              className="rounded-(--radius-cinema) bg-red-2 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-red hover:shadow-cinema"
            >
              Inscription
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

