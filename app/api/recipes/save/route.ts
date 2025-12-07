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

    const { slug, save } = (await req.json()) as { slug: string; save: boolean }
    if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 })

    const update = save
      ? { $addToSet: { savedBy: session.user.id } }
      : { $pull: { savedBy: session.user.id } }

    const recipe = await RecipeModel.findOneAndUpdate({ slug }, update, { new: true })
    if (!recipe) return NextResponse.json({ error: "Recipe not found" }, { status: 404 })

    const isSaved = Array.isArray((recipe as any).savedBy)
      ? (recipe as any).savedBy.map(String).includes(String(session.user.id))
      : false

    return NextResponse.json({ data: { isSaved } })
  } catch (err: any) {
    console.error("Save recipe error", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
