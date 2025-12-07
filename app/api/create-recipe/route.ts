import { NextResponse } from "next/server"
import { auth } from "@/auth"
import connectMongoose from "@/lib/mongodb"
import RecipeModel from "@/app/models/rescipes"

function generateSlug(title: string) {
	return title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
}

export async function POST(request: Request) {
	const session = await auth()

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	try {
		const body = await request.json()

		await connectMongoose()

		const existingSlug = generateSlug(body.title)
		const slugSuffix = Math.random().toString(36).slice(2, 7)
		const slug = existingSlug || slugSuffix

		const recipe = await RecipeModel.create({
			userId: session.user.id,
			title: body.title,
			slug,
			description: body.description,
			imageUrl: body.imageUrl,
			categories: body.categories ?? [],
			difficulty: body.difficulty ?? "medium",
			prepTime: body.prepTime ?? 0,
			cookTime: body.cookTime ?? 0,
			totalTime: body.totalTime ?? (body.prepTime ?? 0) + (body.cookTime ?? 0),
			servings: body.servings ?? 1,
			nutrition: body.nutrition ?? {},
			ingredients: body.ingredients ?? [],
			instructions: body.instructions ?? [],
		})

		return NextResponse.json({
			id: recipe._id,
			slug: recipe.slug,
		})
	} catch (error) {
		console.error("Create recipe error", error)
		return NextResponse.json({ error: "Failed to create recipe" }, { status: 500 })
	}
}
