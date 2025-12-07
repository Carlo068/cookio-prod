import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectMongoose from "@/lib/mongodb"
import RecipeModel from "@/app/models/rescipes"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectMongoose()

    const { slug, like } = (await req.json()) as { slug: string; like: boolean }
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

    const recipe = await RecipeModel.findOne({ slug })
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 })

    const currentLikes = Number(recipe.likes || 0)
    recipe.likes = like ? currentLikes + 1 : Math.max(0, currentLikes - 1)
    ;(recipe as any).isLiked = like

    await recipe.save()

    return NextResponse.json({ data: { likes: recipe.likes, isLiked: !!(recipe as any).isLiked } })
  } catch (err: any) {
    console.error("Like recipe error", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
