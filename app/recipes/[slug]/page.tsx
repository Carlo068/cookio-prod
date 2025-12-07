import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, Users, ChefHat, Calendar, ArrowLeft } from "lucide-react"
import { mockRecipes } from "@/lib/mock-data"
import { formatDate, formatTime } from "@/lib/utils"
import { IngredientList } from "@/app/components/ingredient-list"
import { NutritionSummary } from "@/app/components/nutrition-summary"
import { RecipeActions } from "@/app/components/recipe-actions"

interface RecipePageProps {
  params: Promise<{ slug: string }>
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params
  const recipe = mockRecipes.find((r) => r.slug === slug)

  if (!recipe) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/recipes"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to recipes
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hero Image */}
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            <Image
              src={recipe.imageUrl || "/placeholder.svg?height=600&width=1000&query=delicious food"}
              alt={recipe.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Title & Meta */}
          <div className="mt-6">
            <div className="flex flex-wrap gap-2">
              {recipe.categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium capitalize text-primary"
                >
                  {category}
                </span>
              ))}
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  recipe.difficulty === "easy"
                    ? "bg-green-100 text-green-700"
                    : recipe.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-bold sm:text-4xl">{recipe.title}</h1>
            <p className="mt-3 text-lg text-muted-foreground">{recipe.description}</p>

            {/* Author & Date */}
            <div className="mt-6 flex flex-wrap items-center gap-6 border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                  <ChefHat className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium">{recipe.author.name}</p>
                  <p className="text-xs text-muted-foreground">Recipe creator</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                {formatDate(recipe.createdAt)}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <Clock className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-lg font-semibold">{formatTime(recipe.totalTime)}</p>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <Users className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-lg font-semibold">{recipe.servings}</p>
                <p className="text-xs text-muted-foreground">Servings</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <ChefHat className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-lg font-semibold capitalize">{recipe.difficulty}</p>
                <p className="text-xs text-muted-foreground">Difficulty</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6">
              <RecipeActions recipe={recipe} />
            </div>

            {/* Instructions */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold">Instructions</h2>
              <ol className="mt-4 space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-muted-foreground">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <NutritionSummary nutrition={recipe.nutrition} />
          <IngredientList ingredients={recipe.ingredients} servings={recipe.servings} />
        </div>
      </div>
    </div>
  )
}
