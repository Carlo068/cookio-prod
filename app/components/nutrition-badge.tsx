import type { ReactNode } from "react"

interface NutritionBadgeProps {
  icon?: ReactNode
  value: number
  unit: string
}

export function NutritionBadge({ icon, value, unit }: NutritionBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
      {icon}
      {value} {unit}
    </span>
  )
}
