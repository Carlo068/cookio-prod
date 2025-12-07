export interface Recipe {
  id: string
  slug: string
  title: string
  description: string
  imageUrl: string
  categories: string[]
  difficulty: "easy" | "medium" | "hard"
  prepTime: number
  cookTime: number
  totalTime: number
  servings: number
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  ingredients: Ingredient[]
  instructions: string[]
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
  likes: number
  isLiked?: boolean
  isSaved?: boolean
  createdAt: string
  updatedAt: string
}

export interface Ingredient {
  id?: string
  name: string
  amount: number
  unit: string
}

export interface RecipeFilters {
  search?: string
  category?: string
  maxCalories?: number
  maxTime?: number
  difficulty?: string
  page?: number
  limit?: number
}

export type RecipeSummary = Pick<
  Recipe,
  | "id"
  | "slug"
  | "title"
  | "description"
  | "imageUrl"
  | "categories"
  | "difficulty"
  | "prepTime"
  | "cookTime"
  | "totalTime"
  | "servings"
  | "nutrition"
  | "ingredients"
  | "instructions"
  | "likes"
  | "isLiked"
  | "isSaved"
  | "createdAt"
  | "updatedAt"
> & {
  _id?: string
}
