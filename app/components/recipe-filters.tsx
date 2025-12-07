"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, X } from "lucide-react"

const categories = ["all", "breakfast", "lunch", "dinner", "dessert", "healthy", "vegetarian", "seafood", "american"]

const difficulties = ["all", "easy", "medium", "hard"]

const timeOptions = [
  { label: "Any time", value: "" },
  { label: "Under 30 min", value: "30" },
  { label: "Under 1 hour", value: "60" },
  { label: "Under 2 hours", value: "120" },
]

const calorieOptions = [
  { label: "Any calories", value: "" },
  { label: "Under 300 kcal", value: "300" },
  { label: "Under 500 kcal", value: "500" },
  { label: "Under 700 kcal", value: "700" },
]

export function RecipeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")
  const [difficulty, setDifficulty] = useState(searchParams.get("difficulty") || "all")
  const [maxTime, setMaxTime] = useState(searchParams.get("maxTime") || "")
  const [maxCalories, setMaxCalories] = useState(searchParams.get("maxCalories") || "")

  const updateFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category && category !== "all") params.set("category", category)
    if (difficulty && difficulty !== "all") params.set("difficulty", difficulty)
    if (maxTime) params.set("maxTime", maxTime)
    if (maxCalories) params.set("maxCalories", maxCalories)

    const query = params.toString()
    router.push(query ? `/recipes?${query}` : "/recipes")
  }

  const clearFilters = () => {
    setSearch("")
    setCategory("all")
    setDifficulty("all")
    setMaxTime("")
    setMaxCalories("")
    router.push("/recipes")
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      updateFilters()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setSearch(searchParams.get("search") || "")
    setCategory(searchParams.get("category") || "all")
    setDifficulty(searchParams.get("difficulty") || "all")
    setMaxTime(searchParams.get("maxTime") || "")
    setMaxCalories(searchParams.get("maxCalories") || "")
  }, [searchParams])

  const hasActiveFilters = category !== "all" || difficulty !== "all" || maxTime || maxCalories

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search recipes by title or ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-input bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex h-12 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors ${
            showFilters || hasActiveFilters
              ? "border-primary bg-primary/10 text-primary"
              : "border-input hover:bg-muted"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="hidden sm:inline">Filters</span>
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
              {[category !== "all", difficulty !== "all", maxTime, maxCalories].filter(Boolean).length}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value)
                  setTimeout(updateFilters, 0)
                }}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm capitalize focus:border-primary focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="capitalize">
                    {cat === "all" ? "All Categories" : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="mb-2 block text-sm font-medium">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value)
                  setTimeout(updateFilters, 0)
                }}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm capitalize focus:border-primary focus:outline-none"
              >
                {difficulties.map((diff) => (
                  <option key={diff} value={diff} className="capitalize">
                    {diff === "all" ? "All Levels" : diff}
                  </option>
                ))}
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 block text-sm font-medium">Time</label>
              <select
                value={maxTime}
                onChange={(e) => {
                  setMaxTime(e.target.value)
                  setTimeout(updateFilters, 0)
                }}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
              >
                {timeOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Calories */}
            <div>
              <label className="mb-2 block text-sm font-medium">Calories</label>
              <select
                value={maxCalories}
                onChange={(e) => {
                  setMaxCalories(e.target.value)
                  setTimeout(updateFilters, 0)
                }}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-primary focus:outline-none"
              >
                {calorieOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
