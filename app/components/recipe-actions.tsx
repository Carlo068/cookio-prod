"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Heart, Bookmark, Share2, Pencil, Trash2 } from "lucide-react"
import type { Recipe } from "@/types/recipe"

interface RecipeActionsProps {
  recipe: Recipe
}

export function RecipeActions({ recipe }: RecipeActionsProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isLiked, setIsLiked] = useState(recipe.isLiked || false)
  const [isSaved, setIsSaved] = useState(recipe.isSaved || false)
  const [likes, setLikes] = useState(recipe.likes)

  const isAuthor = session?.user?.email === recipe.author.id

  const handleLike = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    const nextLike = !isLiked
    setIsLiked(nextLike)
    setLikes(nextLike ? likes + 1 : Math.max(0, likes - 1))
    try {
      const res = await fetch("/api/recipes/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: recipe.slug, like: nextLike }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = await res.json()
      setLikes(typeof data?.data?.likes === "number" ? data.data.likes : likes)
      setIsLiked(!!data?.data?.isLiked)
    } catch (e) {
      // revert on error
      setIsLiked(isLiked)
      setLikes(likes)
    }
  }

  const handleSave = async () => {
    if (!session) {
      router.push("/login")
      return
    }
    const nextSaved = !isSaved
    setIsSaved(nextSaved)
    try {
      const res = await fetch("/api/recipes/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: recipe.slug, save: nextSaved }),
      })
      if (!res.ok) throw new Error("Request failed")
      const data = await res.json()
      setIsSaved(!!data?.data?.isSaved)
    } catch (e) {
      setIsSaved(isSaved)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: recipe.title,
        url: window.location.href,
      })
    } else {
      await navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this recipe?")) {
      // API call would go here
      router.push("/recipes")
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          isLiked ? "border-red-200 bg-red-50 text-red-600" : "border-border hover:bg-muted"
        }`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
        {likes}
      </button>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
          isSaved ? "border-primary/20 bg-primary/10 text-primary" : "border-border hover:bg-muted"
        }`}
      >
        <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
        {isSaved ? "Saved" : "Save"}
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {isAuthor && (
        <>
          <button
            onClick={() => router.push(`/recipes/${recipe.id}/edit`)}
            className="flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-destructive/20 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </>
      )}
    </div>
  )
}
