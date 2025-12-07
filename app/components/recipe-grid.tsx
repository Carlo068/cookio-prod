import type { RecipeSummary } from "@/types/recipe"
import { RecipeCard } from "./recipe-card"

interface RecipeGridProps {
  recipes?: RecipeSummary[]
  emptyMessage?: string
  isLoading?: boolean
  errorMessage?: string | null
  skeletonCount?: number
}

export function RecipeGrid({
  recipes = [],
  emptyMessage = "No recipes found",
  isLoading = false,
  errorMessage = null,
  skeletonCount = 6,
}: RecipeGridProps) {
  if (errorMessage) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center text-destructive">
        {errorMessage}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <div key={`recipe-skeleton-${index}`} className="h-72 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }

  if (recipes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id || (recipe as { _id?: string })._id || recipe.slug} recipe={recipe} />
      ))}
    </div>
  )
}
