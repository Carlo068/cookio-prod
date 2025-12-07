import { Schema, model, models, type InferSchemaType } from "mongoose"

const ingredientSchema = new Schema(
	{
		name: { type: String, required: true, trim: true },
		amount: { type: Number, required: true, min: 0 },
		unit: { type: String, default: "" },
	},
	{ _id: false },
)

const nutritionSchema = new Schema(
	{
		calories: { type: Number, default: 0, min: 0 },
		protein: { type: Number, default: 0, min: 0 },
		carbs: { type: Number, default: 0, min: 0 },
		fat: { type: Number, default: 0, min: 0 },
	},
	{ _id: false },
)

const recipeSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
		title: { type: String, required: true, trim: true },
		slug: { type: String, required: true, unique: true, lowercase: true },
		description: { type: String, required: true },
		imageUrl: { type: String },
		categories: [{ type: String, lowercase: true, trim: true }],
		difficulty: { type: String, enum: ["easy", "medium", "hard"], default: "medium" },
		prepTime: { type: Number, default: 0, min: 0 },
		cookTime: { type: Number, default: 0, min: 0 },
		totalTime: { type: Number, default: 0, min: 0 },
		servings: { type: Number, default: 1, min: 1 },
		nutrition: { type: nutritionSchema, default: () => ({}) },
		ingredients: { type: [ingredientSchema], default: [] },
		instructions: { type: [String], default: [] },
		likes: { type: Number, default: 0, min: 0 },
		savedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
	},
	{
		timestamps: true,
	},
)

export type RecipeDocument = InferSchemaType<typeof recipeSchema>

export const RecipeModel = models.Recipe || model("Recipe", recipeSchema)

export default RecipeModel
