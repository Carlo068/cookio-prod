import Link from "next/link"
import Image from "next/image"
import { Clock, Flame, Users } from "lucide-react"
import type { RecipeSummary } from "@/types/recipe"
import { NutritionBadge } from "./nutrition-badge"

interface RecipeCardProps {
  recipe: RecipeSummary
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg hover:shadow-primary/5">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={recipe.imageUrl || "/placeholder.svg?height=300&width=400&query=delicious food dish"}
            alt={recipe.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {recipe.categories.slice(0, 2).map((category) => (
              <span
                key={category}
                className="rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium capitalize backdrop-blur-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4">
          <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground group-hover:text-primary">
            {recipe.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{recipe.description}</p>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {recipe.totalTime} min
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {recipe.servings} servings
            </span>
            <span className="flex items-center gap-1 capitalize">
              <span
                className={`h-2 w-2 rounded-full ${
                  recipe.difficulty === "easy"
                    ? "bg-accent"
                    : recipe.difficulty === "medium"
                      ? "bg-yellow-500"
                      : "bg-destructive"
                }`}
              />
              {recipe.difficulty}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <NutritionBadge icon={<Flame className="h-3 w-3" />} value={recipe.nutrition.calories} unit="kcal" />
            <NutritionBadge value={recipe.nutrition.protein} unit="g protein" />
          </div>
        </div>
      </article>
    </Link>
  )
}
