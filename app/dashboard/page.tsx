import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getUserWatchlist } from "@/app/actions/watchlist"
import { getMovieRecommendations, getSimilarMovies } from "@/lib/tmdb"
import { MovieSection } from "@/components/movies/MovieSection"
import { LibrarySection } from "@/components/library/LibrarySection"


export default async function DashboardPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect("/login")

    const watchlist = await getUserWatchlist()

    const toWatch = watchlist.filter(e => e.status === "to_watch").slice(0, 10)
    const watched = watchlist.filter(e => e.status === "watched")
    const seedMovies = watched.slice(0, 4);

    const seedForRecs = seedMovies.slice(0, 1);
    const seedForSimilars = seedMovies.slice(1, 4);

    const recommendationPromises = seedForRecs.map(movie => getMovieRecommendations(movie.movie_id));
    const recommendationsResults = await Promise.all(recommendationPromises);

    const similarMoviesPromises = seedForSimilars.map(movie => getSimilarMovies(movie.movie_id));
    const similarMoviesResults = await Promise.all(similarMoviesPromises);

    const recommendationSections = seedForRecs.map((movie, index) => ({
        title: `Parce que vous avez vu ${movie.movie_title}`,
        movies: recommendationsResults[index] || []
    })).filter(section => section.movies.length > 0);

    const similarSections = seedForSimilars.map((movie, index) => ({
        title: `Similaire à ${movie.movie_title}`,
        movies: similarMoviesResults[index] || []
    })).filter(section => section.movies.length > 0);

    const allSections = [...recommendationSections, ...similarSections];

    return (
        <div className="container mx-auto py-12 px-6">
            <div
                style={{ animation: "slideUp 0.6s ease-out forwards", opacity: 0 }}
                className="mb-10"
            >
                <h1 className="text-3xl font-bold mb-2">Bonjour, content de vous revoir !</h1>
                <p className="text-muted">
                    Voici quelques recommandations pour votre prochaine soirée ciné.
                </p>
            </div>

            {toWatch.length > 0 && (
                <LibrarySection
                    title="Vos prochains visionnages"
                    entries={toWatch}
                    categoryUrl="/library"
                />
            )}

            {allSections.map((section, index) => (
                <MovieSection
                    key={index}
                    title={section.title}
                    movies={section.movies}
                    categoryUrl={`/explorer`}
                />
            ))}

            {watchlist.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-muted mb-6">Votre bibliothèque est vide. Commencez à explorer pour obtenir des recommandations !</p>
                    <Link href="/explorer" className="px-6 py-3 bg-red hover:bg-red-2 text-text font-medium rounded-md transition-colors shadow-cinema">
                        Explorer les films
                    </Link>
                </div>
            )}
        </div>
    )
}
