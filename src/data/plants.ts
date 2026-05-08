export type Plant = {
  id: string;
  name: string;
  category: "indoor" | "outdoor";
  difficulty: "beginner" | "intermediate" | "advanced";
  soil: string;
  potSize: string;
  sunlight: string;
  watering: string;
  fertilizer: string;
  emoji: string;
  description: string;
};

export const PLANTS: Plant[] = [
  { id: "monstera", name: "Monstera Deliciosa", category: "indoor", difficulty: "beginner", soil: "Well-draining aroid mix", potSize: '10-12"', sunlight: "Bright indirect", watering: "Every 7-10 days", fertilizer: "Balanced 20-20-20 monthly in growing season", emoji: "🌿", description: "Iconic split-leaf tropical that thrives indoors with minimal fuss." },
  { id: "snake", name: "Snake Plant", category: "indoor", difficulty: "beginner", soil: "Cactus / succulent mix", potSize: '6-8"', sunlight: "Low to bright indirect", watering: "Every 2-3 weeks", fertilizer: "Light feed every 6 weeks", emoji: "🪴", description: "Nearly indestructible. Filters air while you sleep." },
  { id: "pothos", name: "Golden Pothos", category: "indoor", difficulty: "beginner", soil: "Standard potting mix", potSize: '6"', sunlight: "Low to medium indirect", watering: "Weekly", fertilizer: "Monthly liquid feed", emoji: "🍃", description: "Trailing vine perfect for beginners and shelves." },
  { id: "fiddle", name: "Fiddle Leaf Fig", category: "indoor", difficulty: "intermediate", soil: "Loamy, well-draining", potSize: '12-14"', sunlight: "Bright indirect, no direct sun", watering: "Weekly when topsoil dry", fertilizer: "Balanced monthly spring–fall", emoji: "🌳", description: "Statement tree with dramatic violin-shaped leaves." },
  { id: "basil", name: "Sweet Basil", category: "outdoor", difficulty: "beginner", soil: "Rich, moist, well-drained", potSize: '8"', sunlight: "Full sun (6+ hrs)", watering: "Every 1-2 days in summer", fertilizer: "Diluted feed every 2 weeks", emoji: "🌱", description: "Fast-growing kitchen herb. Pinch often for bushy growth." },
  { id: "tomato", name: "Cherry Tomato", category: "outdoor", difficulty: "intermediate", soil: "Compost-rich loam", potSize: '14"+', sunlight: "Full sun (8 hrs)", watering: "Deep watering every 2-3 days", fertilizer: "High-potassium weekly when fruiting", emoji: "🍅", description: "Sweet bite-sized harvests all summer long." },
  { id: "rose", name: "Miniature Rose", category: "outdoor", difficulty: "intermediate", soil: "Loamy with compost", potSize: '10-12"', sunlight: "Full sun", watering: "Twice weekly, deep soak", fertilizer: "Rose feed every 4-6 weeks", emoji: "🌹", description: "Compact roses with full-size charm." },
  { id: "mint", name: "Spearmint", category: "outdoor", difficulty: "beginner", soil: "Moist, fertile", potSize: '8"+', sunlight: "Partial to full sun", watering: "Keep soil consistently moist", fertilizer: "Light monthly feed", emoji: "🌿", description: "Vigorous herb — best grown in its own pot." },
  { id: "succulent", name: "Echeveria Succulent", category: "indoor", difficulty: "beginner", soil: "Cactus mix with perlite", potSize: '4-6"', sunlight: "Bright direct", watering: "Every 2-3 weeks, soak & dry", fertilizer: "Light cactus feed twice a year", emoji: "🌵", description: "Rosette-shaped beauties in countless colors." },
  { id: "lavender", name: "English Lavender", category: "outdoor", difficulty: "intermediate", soil: "Sandy, alkaline, well-drained", potSize: '12"', sunlight: "Full sun", watering: "Every 7-10 days, drought tolerant", fertilizer: "Minimal — avoid rich soils", emoji: "💜", description: "Fragrant, pollinator-friendly Mediterranean classic." },
  { id: "aloe", name: "Aloe Vera", category: "indoor", difficulty: "beginner", soil: "Cactus / succulent mix", potSize: '6-8"', sunlight: "Bright indirect to direct", watering: "Every 3 weeks", fertilizer: "Diluted feed twice a year", emoji: "🌵", description: "Healing gel inside every leaf." },
  { id: "chili", name: "Chili Pepper", category: "outdoor", difficulty: "intermediate", soil: "Rich, well-draining", potSize: '10-12"', sunlight: "Full sun", watering: "Every 2 days in summer", fertilizer: "Tomato feed weekly when fruiting", emoji: "🌶️", description: "Spicy harvests from a single compact plant." },
];