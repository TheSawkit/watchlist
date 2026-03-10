export type CategoryPageParams = Promise<{ category: string }>

export interface CategoryPageProps {
  params: CategoryPageParams
}

export type MoviePageParams = Promise<{ id: string }>

export interface MoviePageProps {
  params: MoviePageParams
}

export type TvPageParams = Promise<{ id: string }>

export interface TvPageProps {
  params: TvPageParams
}

export type SeasonPageParams = Promise<{ id: string; seasonNumber: string }>

export interface SeasonPageProps {
  params: SeasonPageParams
}

export type ActorPageParams = Promise<{ id: string }>

export interface ActorPageProps {
  params: ActorPageParams
}
