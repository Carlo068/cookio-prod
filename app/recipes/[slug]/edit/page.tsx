import { redirect, notFound } from "next/navigation"
import { auth } from "@/auth"
import { RecipeForm } from "@/app/components/recipe-form"
import type { Recipe } from "@/types/recipe"

function getBaseUrl() {
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`
  }
  return "http://localhost:3000"
}

async function fetchRecipeBySlug(slug: string): Promise<Recipe | null> {
  const origin = getBaseUrl()
  const qs = new URLSearchParams({ slug })
  const url = new URL(`/api/fetch-recipes?${qs.toString()}`, origin).toString()
  const res = await fetch(url, { next: { revalidate: 0 } })
  if (!res.ok) return null
  const json = await res.json()
  const item = Array.isArray(json?.data) ? json.data.find((r: any) => r.slug === slug) : null
  if (!item) return null
  const r = item as any
  const recipe: Recipe = {
    id: r.id || r._id || r.slug,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    imageUrl: r.imageUrl ?? r.image ?? "/placeholder.svg?height=600&width=1000&query=food",
    categories: Array.isArray(r.categories) ? r.categories : r.category ? [r.category] : [],
    difficulty: r.difficulty ?? "easy",
    prepTime: r.prepTime ?? 0,
    cookTime: r.cookTime ?? 0,
    totalTime: r.totalTime ?? ((r.prepTime || 0) + (r.cookTime || 0)),
    servings: r.servings ?? 0,
    nutrition: {
      calories: r.calories ?? r.nutrition?.calories ?? 0,
      protein: r.nutrition?.protein ?? 0,
      carbs: r.nutrition?.carbs ?? 0,
      fat: r.nutrition?.fat ?? 0,
    },
    ingredients: Array.isArray(r.ingredients) ? r.ingredients : [],
    instructions: Array.isArray(r.instructions) ? r.instructions : [],
    author: {
      id: r.author?.id ?? r.userId ?? "",
      name: r.author?.name ?? r.authorName ?? "Unknown",
      avatarUrl: r.author?.avatarUrl,
    },
    likes: r.likes ?? 0,
    isLiked: r.isLiked ?? false,
    isSaved: r.isSaved ?? false,
    createdAt: r.createdAt ?? new Date().toISOString(),
    updatedAt: r.updatedAt ?? new Date().toISOString(),
  }
  return recipe
}

interface EditRecipePageProps {
  params: Promise<{ slug: string }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const session = await auth()
  const { slug } = await params

  if (!session) {
    redirect("/login")
  }

  const recipe = await fetchRecipeBySlug(slug)

  if (!recipe) {
    notFound()
  }

  // Optional: verify author ownership with session.user.id before allowing edits

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Recipe</h1>
        <p className="mt-2 text-muted-foreground">Update your recipe details</p>
      </div>

      <RecipeForm recipe={recipe} mode="edit" />
    </div>
  )
}
