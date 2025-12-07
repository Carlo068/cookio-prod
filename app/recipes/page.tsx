import { Suspense } from "react"
import { unstable_noStore as noStore } from "next/cache"
import { RecipeFilters } from "@/app/components/recipe-filters"
import { RecipeGrid } from "@/app/components/recipe-grid"
import type { RecipeFilters as FiltersType, RecipeSummary } from "@/types/recipe"

type SearchParams = Record<string, string | string[] | undefined>

type SearchParamsInput = SearchParams | Promise<SearchParams>

interface RecipesPageProps {
  searchParams: SearchParamsInput
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

const DEFAULT_PAGE_SIZE = 12
const MAX_PAGE_SIZE = 48
const FALLBACK_IMAGE = "/placeholder.svg?height=300&width=400&query=delicious food dish"
const FETCH_ERROR_MESSAGE = "Unable to load recipes right now. Please try again later."
const VALID_DIFFICULTIES = new Set(["easy", "medium", "hard"])

const toSingleValue = (value?: string | string[]): string | undefined => {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value ?? undefined
}

const toNumberValue = (value?: string | string[]): number | undefined => {
  const str = toSingleValue(value)
  if (!str) return undefined
  const num = Number(str)
  return Number.isFinite(num) ? num : undefined
}

const ensureDateString = (value: unknown, fallback: string): string => {
  if (value instanceof Date) {
    return value.toISOString()
  }
  if (typeof value === "string" && value.length > 0) {
    return value
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }
  return fallback
}

const getString = (value: unknown): string | undefined => {
  if (typeof value === "string") return value
  if (typeof value === "number" && Number.isFinite(value)) return value.toString()
  if (typeof value === "object" && value !== null && "toString" in value) {
    const stringValue = (value as { toString: () => string }).toString()
    if (typeof stringValue === "string" && stringValue !== "[object Object]") {
      return stringValue
    }
  }
  return undefined
}

const getNumber = (value: unknown, defaultValue = 0): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : defaultValue
}

const parseFilters = (params: SearchParams): FiltersType => {
  const page = toNumberValue(params.page)
  const limit = toNumberValue(params.limit)
  const rawCategory = toSingleValue(params.category)?.toLowerCase()
  const rawDifficulty = toSingleValue(params.difficulty)?.toLowerCase()

  return {
    search: toSingleValue(params.search)?.trim() || undefined,
    category: rawCategory && rawCategory !== "all" ? rawCategory : undefined,
    difficulty: rawDifficulty && VALID_DIFFICULTIES.has(rawDifficulty) ? rawDifficulty : undefined,
    maxTime: toNumberValue(params.maxTime),
    maxCalories: toNumberValue(params.maxCalories),
    page: page && page > 0 ? page : 1,
    limit: limit && limit > 0 ? Math.min(limit, MAX_PAGE_SIZE) : DEFAULT_PAGE_SIZE,
  }
}

const buildQueryString = (filters: FiltersType) => {
  const params = new URLSearchParams()

  if (filters.search) params.set("search", filters.search)
  if (filters.category) params.set("category", filters.category)
  if (filters.difficulty) params.set("difficulty", filters.difficulty)
  if (typeof filters.maxTime === "number" && filters.maxTime > 0) params.set("maxTime", String(filters.maxTime))
  if (typeof filters.maxCalories === "number" && filters.maxCalories > 0) params.set("maxCalories", String(filters.maxCalories))

  params.set("page", String(filters.page ?? 1))
  params.set("limit", String(filters.limit ?? DEFAULT_PAGE_SIZE))

  return params.toString()
}

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return "http://localhost:3000"
}

const normalizeRecipes = (payload: unknown): RecipeSummary[] => {
  if (!Array.isArray(payload)) {
    return []
  }

  return payload.map((recipe, index) => normalizeRecipe(recipe as Record<string, unknown>, index))
}

const normalizeRecipe = (recipe: Record<string, unknown>, index: number): RecipeSummary => {
  const fallbackId =
    getString(recipe["_id"]) ?? getString(recipe["id"]) ?? getString(recipe["slug"]) ?? `recipe-${index}`
  const fallbackTimestamp = new Date().toISOString()
  const createdAt = ensureDateString(recipe["createdAt"], fallbackTimestamp)
  const updatedAt = ensureDateString(recipe["updatedAt"], createdAt)

  const categories = Array.isArray(recipe["categories"])
    ? (recipe["categories"] as unknown[]).filter(
        (category): category is string => typeof category === "string" && category.length > 0,
      )
    : []

  const ingredients = Array.isArray(recipe["ingredients"])
    ? (recipe["ingredients"] as unknown[]).map((ingredient, ingredientIndex) => {
        const entry = ingredient as Record<string, unknown>
        return {
          id: getString(entry["id"]) ?? `${fallbackId}-ingredient-${ingredientIndex}`,
          name: getString(entry["name"]) ?? "",
          amount: getNumber(entry["amount"]),
          unit: getString(entry["unit"]) ?? "",
        }
      })
    : []

  const instructions = Array.isArray(recipe["instructions"])
    ? (recipe["instructions"] as unknown[]).filter(
        (step): step is string => typeof step === "string" && step.trim().length > 0,
      )
    : []

  const nutritionSource = (recipe["nutrition"] as Record<string, unknown>) || {}
  const prepTime = getNumber(recipe["prepTime"])
  const cookTime = getNumber(recipe["cookTime"])
  const totalTime = getNumber(recipe["totalTime"], prepTime + cookTime)

  const rawDifficulty = getString(recipe["difficulty"])?.toLowerCase()
  const difficulty = rawDifficulty && VALID_DIFFICULTIES.has(rawDifficulty) ? rawDifficulty : "medium"

  return {
    id: getString(recipe["id"]) ?? fallbackId,
    slug: getString(recipe["slug"]) ?? fallbackId,
    title: getString(recipe["title"]) ?? "Untitled recipe",
    description: getString(recipe["description"]) ?? "",
    imageUrl: getString(recipe["imageUrl"]) || FALLBACK_IMAGE,
    categories,
    difficulty: difficulty as RecipeSummary["difficulty"],
    prepTime,
    cookTime,
    totalTime,
    servings: Math.max(getNumber(recipe["servings"], 1), 1),
    nutrition: {
      calories: getNumber(nutritionSource["calories"]),
      protein: getNumber(nutritionSource["protein"]),
      carbs: getNumber(nutritionSource["carbs"]),
      fat: getNumber(nutritionSource["fat"]),
    },
    ingredients,
    instructions,
    likes: getNumber(recipe["likes"]),
    isLiked: Boolean(recipe["isLiked"]),
    isSaved: Boolean(recipe["isSaved"]),
    createdAt,
    updatedAt,
  }
}

const fetchRecipes = async (
  filters: FiltersType,
  baseUrl: string,
): Promise<{ recipes: RecipeSummary[]; pagination: PaginationInfo | null; error: string | null }> => {
  const query = buildQueryString(filters)
  const url = `${baseUrl}/api/fetch-recipes${query ? `?${query}` : ""}`

  try {
    const response = await fetch(url, { cache: "no-store" })
    if (!response.ok) {
      throw new Error(`Failed to fetch recipes: ${response.statusText}`)
    }

    const payload = (await response.json()) as {
      data?: unknown
      pagination?: PaginationInfo
    }

    return {
      recipes: normalizeRecipes(payload.data),
      pagination: payload.pagination ?? null,
      error: null,
    }
  } catch (error) {
    console.error("Recipes page fetch error", error)
    return {
      recipes: [],
      pagination: null,
      error: FETCH_ERROR_MESSAGE,
    }
  }
}

const resolveSearchParams = async (params: SearchParamsInput): Promise<SearchParams> => {
  if (typeof (params as Promise<SearchParams>).then === "function") {
    return params as Promise<SearchParams>
  }
  return params as SearchParams
}

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  noStore()

  const resolvedSearchParams = await resolveSearchParams(searchParams)
  const filters = parseFilters(resolvedSearchParams)
  const baseUrl = getBaseUrl()
  const { recipes, pagination, error } = await fetchRecipes(filters, baseUrl)
  const totalRecipes = pagination?.total ?? recipes.length
  const showCountLabel = error
    ? "We couldn't load the recipe count right now."
    : `${totalRecipes} ${totalRecipes === 1 ? "recipe" : "recipes"} found`

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">All Recipes</h1>
        <p className="mt-2 text-muted-foreground">Discover delicious recipes for every occasion</p>
      </div>

      <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-muted" />}>
        <RecipeFilters />
      </Suspense>

      <div className="mt-8">
        <p className="mb-4 text-sm text-muted-foreground">{showCountLabel}</p>
        <RecipeGrid
          recipes={recipes}
          errorMessage={error}
          emptyMessage="No recipes match your filters. Try adjusting your search criteria."
        />
      </div>
    </div>
  )
}
