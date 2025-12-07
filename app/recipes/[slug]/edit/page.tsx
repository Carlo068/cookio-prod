import { redirect, notFound } from "next/navigation"
import { auth } from "@/auth"
import { mockRecipes } from "@/lib/mock-data"
import { RecipeForm } from "@/app/components/recipe-form"

interface EditRecipePageProps {
  params: Promise<{ slug: string }>
}

export default async function EditRecipePage({ params }: EditRecipePageProps) {
  const session = await auth()
  const { slug } = await params

  if (!session) {
    redirect("/login")
  }

  const recipe = mockRecipes.find((r) => r.slug === slug)

  if (!recipe) {
    notFound()
  }

  // Check if user is the author (in real app, compare with session user)
  // For now, we'll allow editing for demo purposes

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
