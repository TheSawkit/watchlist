// ─── Explorer ────────────────────────────────────────────

export type CategoryPageParams = Promise<{ category: string }>

export interface CategoryPageProps {
  params: CategoryPageParams
}

// ─── Movie ───────────────────────────────────────────────

export type MoviePageParams = Promise<{ id: string }>

export interface MoviePageProps {
  params: MoviePageParams
}
