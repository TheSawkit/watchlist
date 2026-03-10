import type { ActorDetails, ActorMovieCredit, ActorTvCredit } from "@/types/tmdb"
import { fetchTMDB } from "./client"

export async function getActorDetails(id: number): Promise<ActorDetails> {
  return fetchTMDB<ActorDetails>(`/person/${id}`)
}

export async function getActorMovieCredits(id: number): Promise<ActorMovieCredit[]> {
  const { cast } = await fetchTMDB<{ cast: ActorMovieCredit[] }>(`/person/${id}/movie_credits`)
  return cast
}

export async function getActorTvCredits(id: number): Promise<ActorTvCredit[]> {
  const { cast } = await fetchTMDB<{ cast: ActorTvCredit[] }>(`/person/${id}/tv_credits`)
  return cast
}
