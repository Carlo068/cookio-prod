import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { ChefHat, BookOpen, Heart } from "lucide-react"
import { ProfileTabs } from "@/app/components/profile-tabs"
import type { RecipeSummary } from "@/types/recipe"

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

interface RecipeFetchResult {
  recipes: RecipeSummary[]
  error: string | null
}

const fetchUserRecipes = async ({ userId, saved }: { userId: string; saved?: boolean }): Promise<RecipeFetchResult> => {
  const params = new URLSearchParams({ userId })
  if (saved) params.set("saved", "true")
  params.set("limit", "50")

  const url = `${getBaseUrl()}/api/fetch-recipes?${params.toString()}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.statusText}`)
    }
    const data = await response.json()
    return {
      recipes: (data?.data as RecipeSummary[]) || [],
      error: null,
    }
  } catch (error) {
    console.error("Profile recipes fetch error", error)
    return {
      recipes: [],
      error: "We couldn't load some of your recipes. Please try again in a moment.",
    }
  }
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const userId = session.user?.id
  if (!userId) {
    redirect("/login")
  }

  const [createdResult, savedResult] = await Promise.all([
    fetchUserRecipes({ userId }),
    fetchUserRecipes({ userId, saved: true }),
  ])

  const myRecipes = createdResult.recipes
  const savedRecipes = savedResult.recipes
  const fetchError = createdResult.error || savedResult.error

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Profile Header */}
      <div className="mb-8 flex flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 sm:flex-row sm:items-start">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
          <ChefHat className="h-12 w-12 text-primary" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-bold">{session.user?.name || "Anonymous Chef"}</h1>
          <p className="text-muted-foreground">{session.user?.email}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 sm:justify-start">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                <strong>{myRecipes.length}</strong> recipes created
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                <strong>{savedRecipes.length}</strong> recipes saved
              </span>
            </div>
          </div>
        </div>
      </div>

      {fetchError && (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {fetchError}
        </div>
      )}

      {/* Tabs */}
      <ProfileTabs myRecipes={myRecipes} savedRecipes={savedRecipes} />
    </div>
  )
}
