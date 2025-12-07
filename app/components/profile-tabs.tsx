"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import type { RecipeSummary } from "@/types/recipe"
import { RecipeGrid } from "@/app/components/recipe-grid"

interface ProfileTabsProps {
  myRecipes: RecipeSummary[]
  savedRecipes: RecipeSummary[]
}

export function ProfileTabs({ myRecipes, savedRecipes }: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<"my-recipes" | "saved">("my-recipes")

  return (
    <div>
      {/* Tab Headers */}
      <div className="mb-6 flex border-b border-border">
        <button
          onClick={() => setActiveTab("my-recipes")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "my-recipes"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          My Recipes ({myRecipes.length})
        </button>
        <button
          onClick={() => setActiveTab("saved")}
          className={`px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === "saved"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Saved Recipes ({savedRecipes.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "my-recipes" && (
        <div>
          {myRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-lg font-medium">No recipes yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Share your first recipe with the community</p>
              <Link
                href="/recipes/create"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Create Recipe
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Recipes you&apos;ve created</p>
                <Link
                  href="/recipes/create"
                  className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  New Recipe
                </Link>
              </div>
              <RecipeGrid recipes={myRecipes} />
            </>
          )}
        </div>
      )}

      {activeTab === "saved" && (
        <div>
          {savedRecipes.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
              <p className="text-lg font-medium">No saved recipes</p>
              <p className="mt-1 text-sm text-muted-foreground">Browse recipes and save your favorites</p>
              <Link
                href="/recipes"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Browse Recipes
              </Link>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-muted-foreground">Recipes you&apos;ve saved for later</p>
              <RecipeGrid recipes={savedRecipes} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
