import { NextResponse } from "next/server"
import connectMongoose from "@/lib/mongodb"
import RecipeModel from "@/app/models/rescipes"

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const search = searchParams.get("search")?.trim()
	const category = searchParams.get("category")?.trim()?.toLowerCase()
	const difficulty = searchParams.get("difficulty")?.trim()?.toLowerCase()
	const maxTime = Number(searchParams.get("maxTime"))
	const maxCalories = Number(searchParams.get("maxCalories"))
	const userId = searchParams.get("userId")?.trim()
	const saved = searchParams.get("saved")?.trim()?.toLowerCase()
	const page = Number(searchParams.get("page") ?? 1)
	const limit = Number(searchParams.get("limit") ?? 12)

	const query: Record<string, unknown> = {}

	if (search) {
		query.$or = [
			{ title: { $regex: search, $options: "i" } },
			{ description: { $regex: search, $options: "i" } },
			{ "ingredients.name": { $regex: search, $options: "i" } },
		]
	}

	if (category && category !== "all") {
		query.categories = category
	}

	if (difficulty && difficulty !== "all") {
		query.difficulty = difficulty
	}

	if (!Number.isNaN(maxTime) && maxTime > 0) {
		query.totalTime = { $lte: maxTime }
	}

	if (!Number.isNaN(maxCalories) && maxCalories > 0) {
		query["nutrition.calories"] = { $lte: maxCalories }
	}

	if (userId) {
		if (saved === "true") {
			query.savedBy = userId
		} else {
			query.userId = userId
		}
	}

	try {
		await connectMongoose()

		const skip = (page - 1) * limit

		const [recipes, total] = await Promise.all([
			RecipeModel.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			RecipeModel.countDocuments(query),
		])

		return NextResponse.json({
			data: recipes,
			pagination: {
				page,
				limit,
				total,
				totalPages: Math.ceil(total / limit) || 1,
			},
		})
	} catch (error) {
		console.error("Fetch recipes error", error)
		return NextResponse.json({ error: "Failed to fetch recipes" }, { status: 500 })
	}
}
