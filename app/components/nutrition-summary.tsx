import { Flame, Dumbbell, Wheat, Droplet } from "lucide-react"

interface NutritionSummaryProps {
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export function NutritionSummary({ nutrition }: NutritionSummaryProps) {
  const items = [
    { label: "Calories", value: nutrition.calories, unit: "kcal", icon: Flame, color: "text-orange-500" },
    { label: "Protein", value: nutrition.protein, unit: "g", icon: Dumbbell, color: "text-red-500" },
    { label: "Carbs", value: nutrition.carbs, unit: "g", icon: Wheat, color: "text-amber-500" },
    { label: "Fat", value: nutrition.fat, unit: "g", icon: Droplet, color: "text-blue-500" },
  ]

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold">Nutrition per serving</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div
              className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted ${item.color}`}
            >
              <item.icon className="h-5 w-5" />
            </div>
            <p className="text-xl font-bold">
              {item.value}
              <span className="text-sm font-normal text-muted-foreground">{item.unit}</span>
            </p>
            <p className="text-xs text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
