import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const user = await prisma.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      email: "demo@example.com",
      name: "Demo User",
    },
  });

  await prisma.recipe.createMany({
    data: [
      {
        title: "Classic Spaghetti Carbonara",
        description: "A traditional Italian pasta dish with eggs, cheese, and pancetta.",
        ingredients: [
          { name: "Spaghetti", amount: 400, unit: "g" },
          { name: "Pancetta", amount: 150, unit: "g" },
          { name: "Eggs", amount: 4, unit: "whole" },
          { name: "Pecorino Romano", amount: 100, unit: "g" },
          { name: "Black pepper", amount: 1, unit: "tsp" },
        ],
        instructions: [
          "Cook spaghetti in salted boiling water until al dente.",
          "Fry pancetta until crispy.",
          "Mix eggs and grated cheese.",
          "Combine pasta with pancetta, remove from heat.",
          "Add egg mixture and toss quickly. Season with pepper.",
        ],
        category: "dinner",
        difficulty: "medium",
        prepTime: 10,
        cookTime: 20,
        servings: 4,
        status: "made_before",
        isPublic: true,
        tags: ["italian", "pasta", "quick"],
        authorId: user.id,
      },
      {
        title: "Avocado Toast",
        description: "Simple and nutritious breakfast with creamy avocado on toasted bread.",
        ingredients: [
          { name: "Bread slices", amount: 2, unit: "slices" },
          { name: "Ripe avocado", amount: 1, unit: "whole" },
          { name: "Lemon juice", amount: 1, unit: "tbsp" },
          { name: "Red pepper flakes", amount: 0.5, unit: "tsp" },
          { name: "Salt", amount: 1, unit: "pinch" },
        ],
        instructions: [
          "Toast the bread until golden.",
          "Mash avocado with lemon juice and salt.",
          "Spread avocado on toast.",
          "Top with red pepper flakes and serve.",
        ],
        category: "breakfast",
        difficulty: "easy",
        prepTime: 5,
        cookTime: 5,
        servings: 1,
        status: "favorite",
        isPublic: true,
        tags: ["healthy", "vegetarian", "quick"],
        authorId: user.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seeding complete.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
