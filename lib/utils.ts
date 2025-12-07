import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(value: string | number | Date) {
  const date = new Date(value)

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(minutes: number) {
  if (Number.isNaN(minutes) || minutes <= 0) {
    return "< 1 min"
  }

  const hrs = Math.floor(minutes / 60)
  const mins = Math.round(minutes % 60)

  if (!hrs) {
    return `${mins} min`
  }

  if (!mins) {
    return `${hrs} hr${hrs > 1 ? "s" : ""}`
  }

  return `${hrs} hr${hrs > 1 ? "s" : ""} ${mins} min`
}
