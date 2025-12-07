import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectMongoose from "@/lib/mongodb"
import RecipeModel from "@/app/models/rescipes"

export async function PATCH(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectMongoose()

    const body = await req.json()
    const { id, slug, updates } = body as {
      id?: string
      slug?: string
      updates: Record<string, any>
    }

    if (!id && !slug) {
      return NextResponse.json({ error: "Provide id or slug" }, { status: 400 })
    }

    const query: any = id ? { _id: id } : { slug }
    const recipe = await RecipeModel.findOne(query)
    if (!recipe) {
      return NextResponse.json({ error: "Recipe not found" }, { status: 404 })
    }

    // Ownership check
    const ownerId = String(recipe.userId || recipe.author?.id || "")
    if (ownerId && ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Allowed fields to update
    const allowed = [
      "title",
      "description",
      "imageUrl",
      "categories",
      "difficulty",
      "prepTime",
      "cookTime",
      "totalTime",
      "servings",
      "nutrition",
      "ingredients",
      "instructions",
    ]

    for (const key of Object.keys(updates || {})) {
      if (allowed.includes(key)) {
        ;(recipe as any)[key] = updates[key]
      }
    }

    // Recompute totalTime if not explicitly provided
    if (updates && updates.totalTime == null) {
      const prep = Number(recipe.prepTime || 0)
      const cook = Number(recipe.cookTime || 0)
      recipe.totalTime = prep + cook
    }

    await recipe.save()

    return NextResponse.json({
      data: {
        id: recipe._id.toString(),
        slug: recipe.slug,
      },
      message: "Recipe updated",
    })
  } catch (err: any) {
    console.error("Edit recipe error", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
