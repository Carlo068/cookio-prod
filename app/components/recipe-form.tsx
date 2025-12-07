"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, Loader2, ImageIcon } from "lucide-react"
import type { Recipe, Ingredient } from "@/types/recipe"

interface RecipeFormProps {
  recipe?: Recipe
  mode: "create" | "edit"
}

const categories = ["breakfast", "lunch", "dinner", "dessert", "healthy", "vegetarian", "seafood", "american"]

const difficulties = ["easy", "medium", "hard"] as const

export function RecipeForm({ recipe, mode }: RecipeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    title: recipe?.title || "",
    description: recipe?.description || "",
    imageUrl: recipe?.imageUrl || "",
    categories: recipe?.categories || [],
    difficulty: recipe?.difficulty || "medium",
    prepTime: recipe?.prepTime || 15,
    cookTime: recipe?.cookTime || 30,
    servings: recipe?.servings || 4,
    instructions: recipe?.instructions || [""],
  })

  const [ingredients, setIngredients] = useState<Omit<Ingredient, "id">[]>(
    recipe?.ingredients.map(({ name, amount, unit }) => ({ name, amount, unit })) || [
      { name: "", amount: 1, unit: "" },
    ],
  )

  const [nutrition, setNutrition] = useState({
    calories: recipe?.nutrition.calories || 0,
    protein: recipe?.nutrition.protein || 0,
    carbs: recipe?.nutrition.carbs || 0,
    fat: recipe?.nutrition.fat || 0,
  })

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: 1, unit: "" }])
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const updateIngredient = (index: number, field: keyof Omit<Ingredient, "id">, value: string | number) => {
    const updated = [...ingredients]
    updated[index] = { ...updated[index], [field]: value }
    setIngredients(updated)
  }

  const addInstruction = () => {
    setFormData({ ...formData, instructions: [...formData.instructions, ""] })
  }

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index),
    })
  }

  const updateInstruction = (index: number, value: string) => {
    const updated = [...formData.instructions]
    updated[index] = value
    setFormData({ ...formData, instructions: updated })
  }

  const toggleCategory = (category: string) => {
    if (formData.categories.includes(category)) {
      setFormData({
        ...formData,
        categories: formData.categories.filter((c) => c !== category),
      })
    } else {
      setFormData({
        ...formData,
        categories: [...formData.categories, category],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const sanitizedInstructions = formData.instructions
        .map((instruction) => instruction.trim())
        .filter((instruction) => instruction.length > 0)

      const payload = {
        ...formData,
        totalTime: Math.max(0, formData.prepTime) + Math.max(0, formData.cookTime),
        servings: Math.max(1, formData.servings),
        ingredients: ingredients
          .filter((ingredient) => ingredient.name.trim())
          .map((ingredient) => ({
            name: ingredient.name.trim(),
            amount: Number(ingredient.amount) || 0,
            unit: ingredient.unit.trim(),
          })),
        nutrition: {
          calories: Math.max(0, nutrition.calories),
          protein: Math.max(0, nutrition.protein),
          carbs: Math.max(0, nutrition.carbs),
          fat: Math.max(0, nutrition.fat),
        },
        instructions: sanitizedInstructions,
      }

      const isCreateMode = mode === "create"
      const url = isCreateMode ? "/api/create-recipe" : `/api/recipes/${recipe?.id}`
      const method = isCreateMode ? "POST" : "PUT"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        throw new Error("Failed to save recipe")
      }

      const data = await res.json()
      router.push(`/recipes/${data.slug || recipe?.slug}`)
      router.refresh()
    } catch {
      setError("Failed to save recipe. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {/* Basic Info */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              Recipe Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Creamy Garlic Tuscan Salmon"
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium">
              Description *
            </label>
            <textarea
              id="description"
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A brief description of your recipe..."
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="imageUrl" className="mb-2 block text-sm font-medium">
              Image URL
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <ImageIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="h-12 w-full rounded-lg border border-input bg-background pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories & Difficulty */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Categories & Difficulty</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-colors ${
                    formData.categories.includes(category)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">Difficulty</label>
            <div className="flex gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty: diff })}
                  className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium capitalize transition-colors ${
                    formData.difficulty === diff
                      ? "bg-primary text-primary-foreground"
                      : "border border-border hover:bg-muted"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Time & Servings */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Time & Servings</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="prepTime" className="mb-2 block text-sm font-medium">
              Prep Time (min)
            </label>
            <input
              id="prepTime"
              type="number"
              min="0"
              value={formData.prepTime}
              onChange={(e) => setFormData({ ...formData, prepTime: Number(e.target.value) })}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="cookTime" className="mb-2 block text-sm font-medium">
              Cook Time (min)
            </label>
            <input
              id="cookTime"
              type="number"
              min="0"
              value={formData.cookTime}
              onChange={(e) => setFormData({ ...formData, cookTime: Number(e.target.value) })}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="servings" className="mb-2 block text-sm font-medium">
              Servings
            </label>
            <input
              id="servings"
              type="number"
              min="1"
              value={formData.servings}
              onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Nutrition */}
      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Nutrition (per serving)</h2>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label htmlFor="calories" className="mb-2 block text-sm font-medium">
              Calories
            </label>
            <input
              id="calories"
              type="number"
              min="0"
              value={nutrition.calories}
              onChange={(e) => setNutrition({ ...nutrition, calories: Number(e.target.value) })}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="protein" className="mb-2 block text-sm font-medium">
              Protein (g)
            </label>
            <input
              id="protein"
              type="number"
              min="0"
              value={nutrition.protein}
              onChange={(e) => setNutrition({ ...nutrition, protein: Number(e.target.value) })}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="carbs" className="mb-2 block text-sm font-medium">
              Carbs (g)
            </label>
            <input
              id="carbs"
              type="number"
              min="0"
              value={nutrition.carbs}
              onChange={(e) => setNutrition({ ...nutrition, carbs: Number(e.target.value) })}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="fat" className="mb-2 block text-sm font-medium">
              Fat (g)
            </label>
            <input
              id="fat"
              type="number"
              min="0"
              value={nutrition.fat}
              onChange={(e) => setNutrition({ ...nutrition, fat: Number(e.target.value) })}
              className="h-12 w-full rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* Ingredients */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Ingredients</h2>
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add Ingredient
          </button>
        </div>
        <div className="space-y-3">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, "name", e.target.value)}
                placeholder="Ingredient name"
                className="h-12 flex-1 rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="number"
                min="0"
                step="0.25"
                value={ingredient.amount}
                onChange={(e) => updateIngredient(index, "amount", Number(e.target.value))}
                placeholder="Amount"
                className="h-12 w-24 rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, "unit", e.target.value)}
                placeholder="Unit"
                className="h-12 w-24 rounded-lg border border-input bg-background px-4 text-sm focus:border-primary focus:outline-none"
              />
              {ingredients.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Instructions */}
      <section className="rounded-xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Instructions</h2>
          <button
            type="button"
            onClick={addInstruction}
            className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            <Plus className="h-4 w-4" />
            Add Step
          </button>
        </div>
        <div className="space-y-3">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                {index + 1}
              </span>
              <textarea
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Step ${index + 1}...`}
                rows={2}
                className="flex-1 rounded-lg border border-input bg-background px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              {formData.instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Submit */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-border px-6 py-3 font-medium hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Recipe" : "Save Changes"}
        </button>
      </div>
    </form>
  )
}
