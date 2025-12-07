import Link from "next/link"
import { ArrowRight, ChefHat, Clock, Sparkles, Users } from "lucide-react"
import { RecipeGrid } from "./components/recipe-grid"
import type { RecipeSummary } from "@/types/recipe"

function getBaseUrl() {
  // Prefer explicit env; fallback to relative during SSR
  const url = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL
  if (url) {
    return url.startsWith("http") ? url : `https://${url}`
  }
  return ""
}

async function fetchPopularRecipes(limit: number = 6): Promise<RecipeSummary[]> {
  const baseUrl = getBaseUrl()
  const qs = new URLSearchParams({ limit: String(limit), page: "1" })
  const origin = baseUrl || "http://localhost:3000"
  const endpoint = new URL(`/api/fetch-recipes?${qs.toString()}`, origin).toString()
  const res = await fetch(endpoint, { next: { revalidate: 60 } })
  if (!res.ok) return []
  const json = await res.json()
  const data = Array.isArray(json?.data) ? json.data : []
  // Normalize to RecipeSummary
  return data.map((r: any) => ({
    id: r.id || r._id || r.slug,
    _id: r._id,
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    imageUrl: r.imageUrl ?? r.image ?? "/placeholder.svg?height=300&width=400&query=food",
    categories: Array.isArray(r.categories)
      ? r.categories
      : r.category
        ? [r.category]
        : [],
    difficulty: r.difficulty,
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
    likes: r.likes ?? 0,
    isLiked: r.isLiked ?? false,
    isSaved: r.isSaved ?? false,
    createdAt: r.createdAt ?? "",
    updatedAt: r.updatedAt ?? "",
  }))
}

export default async function Home() {
  const popularRecipes = await fetchPopularRecipes(6)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              Discover new flavors every day
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Cook with confidence, <span className="text-primary">share with love</span>
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Explore thousands of recipes from home cooks around the world. Find your next favorite dish, save recipes,
              and share your own culinary creations.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/recipes"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
              >
                Browse Recipes
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register"
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border px-8 text-base font-semibold transition-colors hover:bg-muted sm:w-auto"
              >
                Join the Community
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-y border-border bg-card/50">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">10k+</p>
              <p className="mt-1 text-sm text-muted-foreground">Recipes</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">50k+</p>
              <p className="mt-1 text-sm text-muted-foreground">Home Cooks</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">100+</p>
              <p className="mt-1 text-sm text-muted-foreground">Categories</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">4.9</p>
              <p className="mt-1 text-sm text-muted-foreground">Avg Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <ChefHat className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Easy to Follow</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Step-by-step instructions with detailed ingredient lists make cooking a breeze.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Time Estimates</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Know exactly how long each recipe takes with accurate prep and cook times.
            </p>
          </div>
          <div className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Community Driven</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Share your recipes and discover favorites from cooks around the world.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Recipes Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Popular Recipes</h2>
            <p className="mt-2 text-muted-foreground">Trending dishes loved by our community</p>
          </div>
          <Link
            href="/recipes"
            className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
          >
            View all recipes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <RecipeGrid recipes={popularRecipes} />

        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            View all recipes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">Ready to share your recipes?</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of home cooks sharing their favorite dishes. Create an account and start uploading your
              recipes today.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}