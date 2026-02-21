export type RecipeStatus = "favorite" | "to_try" | "made_before";
export type Difficulty = "easy" | "medium" | "hard";
export type Category =
  | "breakfast"
  | "lunch"
  | "dinner"
  | "dessert"
  | "snack"
  | "beverage"
  | "other";

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string | null;
  ingredients: Ingredient[];
  instructions: string[];
  category: Category;
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl: string | null;
  status: RecipeStatus;
  isPublic: boolean;
  authorId: string;
  author?: User;
  tags: string[];
  canEdit?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SharedRecipe {
  id: string;
  recipeId: string;
  recipe?: Recipe;
  sharedById: string;
  sharedBy?: User;
  sharedWithId: string;
  sharedWith?: User;
  canEdit: boolean;
  createdAt: Date;
}

export interface MealPlan {
  id: string;
  userId: string;
  week: string;
  monday: string | null;
  tuesday: string | null;
  wednesday: string | null;
  thursday: string | null;
  friday: string | null;
  saturday: string | null;
  sunday: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRecipeInput {
  title: string;
  description?: string;
  ingredients: Omit<Ingredient, "id">[];
  instructions: string[];
  category: Category;
  difficulty: Difficulty;
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
  status?: RecipeStatus;
  isPublic?: boolean;
  tags?: string[];
}

export interface UpdateRecipeInput extends Partial<CreateRecipeInput> {
  id: string;
}

export interface RecipeFilters {
  search?: string;
  ingredient?: string;
  cuisine?: string;
  maxPrepTime?: number;
  category?: Category;
  difficulty?: Difficulty;
  status?: RecipeStatus;
  isPublic?: boolean;
  authorId?: string;
  tags?: string[];
}

export interface AIGenerateRecipeInput {
  prompt: string;
  servings?: number;
  dietary?: string[];
  cuisine?: string;
}

export interface AISubstituteInput {
  ingredient: string;
  recipeContext?: string;
  dietary?: string[];
}

export interface AIMealPlanInput {
  preferences?: string[];
  dietary?: string[];
  servings?: number;
  daysCount?: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
