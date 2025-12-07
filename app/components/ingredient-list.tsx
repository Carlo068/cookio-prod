import type { Ingredient } from "@/types/recipe"

interface IngredientListProps {
  ingredients: Ingredient[]
  servings: number
}

export function IngredientList({ ingredients, servings }: IngredientListProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Ingredients</h3>
        <span className="text-sm text-muted-foreground">{servings} servings</span>
      </div>
      <ul className="space-y-3">
        {ingredients.map((ingredient) => (
          <li
            key={ingredient.id}
            className="flex items-center gap-3 border-b border-border pb-3 last:border-0 last:pb-0"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border">
              <div className="h-2 w-2 rounded-full bg-primary" />
            </div>
            <span className="flex-1 text-sm">{ingredient.name}</span>
            <span className="text-sm font-medium text-muted-foreground">
              {ingredient.amount} {ingredient.unit}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
