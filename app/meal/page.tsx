"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Utensils,
  Apple,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Save,
  Plus,
  X,
  Info,
  Heart,
  Award,
  Clock,
  Droplets,
  Flame,
  Leaf,
  Sparkles,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { db, auth } from "@/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

// Types for our application
interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image: string;
  category: string;
  tags: string[];
  description: string;
  ingredients: string[];
  preparationTime: number;
}

interface MealPlan {
  [day: string]: {
    breakfast: Meal | null;
    lunch: Meal | null;
    dinner: Meal | null;
    snacks: Meal[];
  };
}

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const mealTypes = ["breakfast", "lunch", "dinner", "snacks"];

// Predefined meals since we can't use the search API
const predefinedMeals: Meal[] = [
  {
    id: "1",
    name: "Avocado Toast with Egg",
    calories: 350,
    protein: 15,
    carbs: 30,
    fat: 20,
    image: "/placeholder.svg?height=200&width=200",
    category: "breakfast",
    tags: ["High Protein", "Vegetarian"],
    description:
      "Whole grain toast topped with mashed avocado, a poached egg, and red pepper flakes.",
    ingredients: [
      "2 slices whole grain bread",
      "1 ripe avocado",
      "2 eggs",
      "Salt and pepper to taste",
      "Red pepper flakes",
      "1 tbsp olive oil",
    ],
    preparationTime: 15,
  },
  {
    id: "2",
    name: "Greek Yogurt Parfait",
    calories: 280,
    protein: 18,
    carbs: 35,
    fat: 8,
    image: "/placeholder.svg?height=200&width=200",
    category: "breakfast",
    tags: ["High Protein", "Low Fat"],
    description:
      "Layers of Greek yogurt, fresh berries, and granola for a quick and nutritious breakfast.",
    ingredients: [
      "1 cup Greek yogurt",
      "1/2 cup mixed berries",
      "1/4 cup granola",
      "1 tbsp honey",
    ],
    preparationTime: 5,
  },
  {
    id: "3",
    name: "Quinoa Veggie Bowl",
    calories: 420,
    protein: 12,
    carbs: 65,
    fat: 14,
    image: "/placeholder.svg?height=200&width=200",
    category: "lunch",
    tags: ["Vegan", "Gluten-Free"],
    description:
      "Nutrient-rich quinoa topped with roasted vegetables and a tahini dressing.",
    ingredients: [
      "1 cup cooked quinoa",
      "1 cup roasted vegetables (bell peppers, zucchini, onions)",
      "1/4 cup chickpeas",
      "2 tbsp tahini dressing",
      "Fresh herbs for garnish",
    ],
    preparationTime: 25,
  },
  {
    id: "4",
    name: "Grilled Chicken Salad",
    calories: 380,
    protein: 35,
    carbs: 15,
    fat: 18,
    image: "/placeholder.svg?height=200&width=200",
    category: "lunch",
    tags: ["High Protein", "Low Carb"],
    description:
      "Fresh mixed greens topped with grilled chicken, cherry tomatoes, cucumber, and balsamic vinaigrette.",
    ingredients: [
      "4 oz grilled chicken breast",
      "2 cups mixed greens",
      "1/2 cup cherry tomatoes",
      "1/2 cucumber, sliced",
      "2 tbsp balsamic vinaigrette",
      "1/4 avocado, sliced",
    ],
    preparationTime: 20,
  },
  {
    id: "5",
    name: "Salmon with Roasted Vegetables",
    calories: 450,
    protein: 30,
    carbs: 25,
    fat: 25,
    image: "/placeholder.svg?height=200&width=200",
    category: "dinner",
    tags: ["Omega-3", "Gluten-Free"],
    description:
      "Baked salmon fillet with a side of colorful roasted vegetables and herbs.",
    ingredients: [
      "6 oz salmon fillet",
      "2 cups mixed vegetables (broccoli, carrots, Brussels sprouts)",
      "2 tbsp olive oil",
      "2 cloves garlic, minced",
      "Fresh herbs (rosemary, thyme)",
      "Salt and pepper to taste",
    ],
    preparationTime: 30,
  },
  {
    id: "6",
    name: "Vegetarian Chili",
    calories: 320,
    protein: 15,
    carbs: 45,
    fat: 10,
    image: "/placeholder.svg?height=200&width=200",
    category: "dinner",
    tags: ["Vegetarian", "High Fiber"],
    description:
      "Hearty vegetarian chili with beans, vegetables, and warming spices.",
    ingredients: [
      "1 cup mixed beans (black beans, kidney beans)",
      "1 onion, diced",
      "1 bell pepper, diced",
      "2 cloves garlic, minced",
      "1 can diced tomatoes",
      "Chili spices (cumin, paprika, chili powder)",
      "1/4 cup vegetable broth",
    ],
    preparationTime: 40,
  },
  {
    id: "7",
    name: "Apple with Almond Butter",
    calories: 200,
    protein: 5,
    carbs: 25,
    fat: 10,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    tags: ["Vegan", "Gluten-Free"],
    description:
      "Sliced apple with a tablespoon of almond butter for a satisfying snack.",
    ingredients: ["1 medium apple", "1 tbsp almond butter"],
    preparationTime: 2,
  },
  {
    id: "8",
    name: "Hummus with Veggie Sticks",
    calories: 180,
    protein: 6,
    carbs: 20,
    fat: 8,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    tags: ["Vegan", "Low Calorie"],
    description:
      "Creamy hummus served with fresh vegetable sticks for dipping.",
    ingredients: [
      "1/4 cup hummus",
      "1 cup mixed vegetable sticks (carrots, celery, bell peppers)",
    ],
    preparationTime: 5,
  },
  {
    id: "9",
    name: "Overnight Oats",
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 10,
    image: "/placeholder.svg?height=200&width=200",
    category: "breakfast",
    tags: ["High Fiber", "Vegetarian"],
    description:
      "Oats soaked overnight with milk, chia seeds, and topped with fruits and nuts.",
    ingredients: [
      "1/2 cup rolled oats",
      "1/2 cup milk or plant-based alternative",
      "1 tbsp chia seeds",
      "1 tbsp maple syrup",
      "1/4 cup mixed berries",
      "1 tbsp chopped nuts",
    ],
    preparationTime: 5,
  },
  {
    id: "10",
    name: "Turkey and Avocado Wrap",
    calories: 350,
    protein: 25,
    carbs: 30,
    fat: 15,
    image: "/placeholder.svg?height=200&width=200",
    category: "lunch",
    tags: ["High Protein", "Balanced"],
    description:
      "Whole grain wrap filled with lean turkey, avocado, lettuce, and mustard.",
    ingredients: [
      "1 whole grain wrap",
      "4 oz sliced turkey breast",
      "1/4 avocado, sliced",
      "1 cup lettuce",
      "1 tbsp mustard",
      "Sliced tomato",
    ],
    preparationTime: 10,
  },
  {
    id: "11",
    name: "Stir-Fried Tofu with Vegetables",
    calories: 380,
    protein: 20,
    carbs: 35,
    fat: 18,
    image: "/placeholder.svg?height=200&width=200",
    category: "dinner",
    tags: ["Vegetarian", "High Protein"],
    description:
      "Crispy tofu stir-fried with colorful vegetables in a savory sauce.",
    ingredients: [
      "8 oz firm tofu, cubed",
      "2 cups mixed vegetables (broccoli, carrots, snap peas)",
      "2 tbsp soy sauce",
      "1 tbsp sesame oil",
      "2 cloves garlic, minced",
      "1 tbsp ginger, minced",
      "1 tbsp cornstarch (for sauce thickening)",
    ],
    preparationTime: 25,
  },
  {
    id: "12",
    name: "Greek Yogurt with Honey",
    calories: 150,
    protein: 15,
    carbs: 15,
    fat: 3,
    image: "/placeholder.svg?height=200&width=200",
    category: "snacks",
    tags: ["High Protein", "Probiotic"],
    description:
      "Creamy Greek yogurt drizzled with honey and a sprinkle of cinnamon.",
    ingredients: ["1 cup Greek yogurt", "1 tbsp honey", "Pinch of cinnamon"],
    preparationTime: 2,
  },
];

// Nutrition tips for educational content
const nutritionTips = [
  {
    id: "tip1",
    title: "Balanced Nutrition",
    icon: <Heart className="h-5 w-5 text-red-500" />,
    content:
      "Aim for a balanced plate with 1/2 vegetables, 1/4 protein, and 1/4 whole grains. Include a variety of colors to ensure you're getting different nutrients.",
  },
  {
    id: "tip2",
    title: "Portion Control",
    icon: <Award className="h-5 w-5 text-amber-500" />,
    content:
      "Be mindful of portion sizes. Use smaller plates, measure servings, and listen to your body's hunger cues. Remember that restaurant portions are often 2-3 times larger than recommended serving sizes.",
  },
  {
    id: "tip3",
    title: "Meal Prep Benefits",
    icon: <Clock className="h-5 w-5 text-blue-500" />,
    content:
      "Planning meals in advance helps you make healthier choices, save money, reduce food waste, and save time during busy weekdays. Set aside 2-3 hours on the weekend to prep meals for the week.",
  },
  {
    id: "tip4",
    title: "Hydration",
    icon: <Droplets className="h-5 w-5 text-cyan-500" />,
    content:
      "Stay hydrated by drinking water throughout the day. Aim for 8 glasses daily, and more if you're active or in hot weather. Herbal teas and infused water can be great alternatives.",
  },
  {
    id: "tip5",
    title: "Protein Importance",
    icon: <Flame className="h-5 w-5 text-orange-500" />,
    content:
      "Protein is essential for muscle repair and growth. Include a source of protein in each meal. Good sources include lean meats, fish, eggs, dairy, legumes, tofu, and tempeh.",
  },
  {
    id: "tip6",
    title: "Mindful Eating",
    icon: <Sparkles className="h-5 w-5 text-purple-500" />,
    content:
      "Eat slowly and without distractions. Pay attention to hunger and fullness cues. This helps prevent overeating and improves digestion and satisfaction from meals.",
  },
  {
    id: "tip7",
    title: "Plant-Based Benefits",
    icon: <Leaf className="h-5 w-5 text-green-500" />,
    content:
      "Try incorporating more plant-based meals into your week. Plant foods are rich in fiber, vitamins, minerals, and antioxidants that support overall health and reduce risk of chronic diseases.",
  },
];

export default function MealPlanner() {
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>(predefinedMeals);
  const [activeMealType, setActiveMealType] = useState<string>("all");
  const [mealPlan, setMealPlan] = useState<MealPlan>(() => {
    // Initialize meal plan structure
    const initialPlan: MealPlan = {};
    days.forEach((day) => {
      initialPlan[day] = {
        breakfast: null,
        lunch: null,
        dinner: null,
        snacks: [],
      };
    });
    return initialPlan;
  });
  const [activeDay, setActiveDay] = useState(days[0]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPlan, setSavingPlan] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState(0);

  // Check authentication status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setIsAuthenticated(!!currentUser);
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Load meal plan from Firebase if user is authenticated
  useEffect(() => {
    if (user) {
      const userMealPlanRef = doc(db, "mealPlans", user.uid);

      getDoc(userMealPlanRef)
        .then((docSnap) => {
          if (docSnap.exists()) {
            setMealPlan(docSnap.data() as MealPlan);
          }
        })
        .catch((error) => {
          console.error("Error loading meal plan:", error);
        });
    }
  }, [user]);

  // Filter meals by type
  useEffect(() => {
    if (activeMealType === "all") {
      setFilteredMeals(predefinedMeals);
    } else {
      setFilteredMeals(
        predefinedMeals.filter((meal) => meal.category === activeMealType)
      );
    }
  }, [activeMealType]);

  // Show a random nutrition tip every 30 seconds
  useEffect(() => {
    if (!showTip) {
      const timer = setTimeout(() => {
        setCurrentTip(Math.floor(Math.random() * nutritionTips.length));
        setShowTip(true);

        // Hide the tip after 10 seconds
        const hideTimer = setTimeout(() => {
          setShowTip(false);
        }, 10000);

        return () => clearTimeout(hideTimer);
      }, 30000);

      return () => clearTimeout(timer);
    }
  }, [showTip]);

  const addToMealPlan = (meal: Meal, day: string, mealType: string) => {
    setMealPlan((prev) => {
      const newPlan = { ...prev };
      if (mealType === "snacks") {
        newPlan[day].snacks = [...(newPlan[day].snacks || []), meal];
      } else {
        newPlan[day][mealType as "breakfast" | "lunch" | "dinner"] = meal;
      }
      return newPlan;
    });

    toast({
      title: "Added to meal plan",
      description: `${meal.name} added to ${day}'s ${mealType}`,
    });
  };

  const removeFromMealPlan = (
    day: string,
    mealType: string,
    index?: number
  ) => {
    setMealPlan((prev) => {
      const newPlan = { ...prev };
      if (mealType === "snacks" && typeof index === "number") {
        newPlan[day].snacks = newPlan[day].snacks.filter((_, i) => i !== index);
      } else {
        newPlan[day][mealType as "breakfast" | "lunch" | "dinner"] = null;
      }
      return newPlan;
    });
  };

  const saveMealPlan = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to save your meal plan",
        variant: "destructive",
      });
      router.push("/auth");
      return;
    }

    setSavingPlan(true);
    try {
      await setDoc(doc(db, "mealPlans", user.uid), mealPlan);

      toast({
        title: "Meal plan saved",
        description: "Your meal plan has been saved successfully",
      });
    } catch (error) {
      console.error("Error saving meal plan:", error);
      toast({
        title: "Error",
        description: "Failed to save meal plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSavingPlan(false);
    }
  };

  const calculateDailyNutrition = (day: string) => {
    const meals = mealPlan[day];
    let totalCalories = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalCarbs = 0;

    // Add breakfast nutrition
    if (meals.breakfast) {
      totalCalories += meals.breakfast.calories;
      totalProtein += meals.breakfast.protein;
      totalFat += meals.breakfast.fat;
      totalCarbs += meals.breakfast.carbs;
    }

    // Add lunch nutrition
    if (meals.lunch) {
      totalCalories += meals.lunch.calories;
      totalProtein += meals.lunch.protein;
      totalFat += meals.lunch.fat;
      totalCarbs += meals.lunch.carbs;
    }

    // Add dinner nutrition
    if (meals.dinner) {
      totalCalories += meals.dinner.calories;
      totalProtein += meals.dinner.protein;
      totalFat += meals.dinner.fat;
      totalCarbs += meals.dinner.carbs;
    }

    // Add snacks nutrition
    meals.snacks.forEach((snack) => {
      totalCalories += snack.calories;
      totalProtein += snack.protein;
      totalFat += snack.fat;
      totalCarbs += snack.carbs;
    });

    return {
      calories: totalCalories,
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs,
    };
  };

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case "breakfast":
        return <Coffee className="h-5 w-5" />;
      case "lunch":
        return <Sun className="h-5 w-5" />;
      case "dinner":
        return <Moon className="h-5 w-5" />;
      case "snacks":
        return <Cookie className="h-5 w-5" />;
      default:
        return <Utensils className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0284c7]/20 flex items-center justify-center">
        <div className="text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0284c7]/20">
      {/* Floating Nutrition Tip */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md"
          >
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {nutritionTips[currentTip].icon}
                  <div>
                    <h4 className="font-medium text-sm">
                      {nutritionTips[currentTip].title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {nutritionTips[currentTip].content}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 rounded-full"
                    onClick={() => setShowTip(false)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
              className="hover:bg-[#0284c7]/10 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold flex items-center">
                <Utensils className="h-6 w-6 mr-2 text-[#0284c7]" />
                Meal Planner
              </h1>
            </motion.div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={saveMealPlan}
                disabled={savingPlan}
                className="hover:bg-[#0284c7]/10 transition-colors"
              >
                <Save className="h-4 w-4 mr-2" />
                {savingPlan ? "Saving..." : "Save Plan"}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => router.push("/auth")}
                className="hover:bg-[#0284c7]/10 transition-colors"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Meal Library */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Apple className="h-5 w-5 mr-2 text-green-500" />
                    Meal Library
                  </CardTitle>
                  <CardDescription>
                    Browse our collection of healthy meals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-thin">
                    <Button
                      variant={activeMealType === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveMealType("all")}
                      className="whitespace-nowrap"
                    >
                      <Utensils className="h-4 w-4 mr-1" /> All Meals
                    </Button>
                    <Button
                      variant={
                        activeMealType === "breakfast" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("breakfast")}
                      className="whitespace-nowrap"
                    >
                      <Coffee className="h-4 w-4 mr-1" /> Breakfast
                    </Button>
                    <Button
                      variant={
                        activeMealType === "lunch" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("lunch")}
                      className="whitespace-nowrap"
                    >
                      <Sun className="h-4 w-4 mr-1" /> Lunch
                    </Button>
                    <Button
                      variant={
                        activeMealType === "dinner" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("dinner")}
                      className="whitespace-nowrap"
                    >
                      <Moon className="h-4 w-4 mr-1" /> Dinner
                    </Button>
                    <Button
                      variant={
                        activeMealType === "snacks" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setActiveMealType("snacks")}
                      className="whitespace-nowrap"
                    >
                      <Cookie className="h-4 w-4 mr-1" /> Snacks
                    </Button>
                  </div>

                  <div className="space-y-4 mt-4">
                    {filteredMeals.map((meal, index) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                        className="transition-all"
                      >
                        <Card className="overflow-hidden hover:shadow-md transition-shadow">
                          <div className="flex">
                            <div className="h-24 w-24 bg-muted flex items-center justify-center">
                              {getMealTypeIcon(meal.category)}
                            </div>
                            <div className="p-3 flex-1">
                              <h3 className="font-medium text-sm line-clamp-1">
                                {meal.name}
                              </h3>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {meal.tags.slice(0, 2).map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="flex justify-between items-center mt-2">
                                <span className="text-xs text-muted-foreground">
                                  {meal.calories} cal
                                </span>
                                <div className="flex gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                    onClick={() => setSelectedMeal(meal)}
                                  >
                                    Details
                                  </Button>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2"
                                      >
                                        <Plus className="h-3 w-3 mr-1" />
                                        Add
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>
                                          Add to Meal Plan
                                        </DialogTitle>
                                        <DialogDescription>
                                          Select a day and meal type to add this
                                          meal to your plan.
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div>
                                          <h4 className="mb-2 text-sm font-medium">
                                            Select Day
                                          </h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            {days.map((day) => (
                                              <Button
                                                key={day}
                                                variant={
                                                  selectedDay === day
                                                    ? "default"
                                                    : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                  setSelectedDay(day)
                                                }
                                              >
                                                {day}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <h4 className="mb-2 text-sm font-medium">
                                            Select Meal
                                          </h4>
                                          <div className="grid grid-cols-2 gap-2">
                                            {mealTypes.map((type) => (
                                              <Button
                                                key={type}
                                                variant={
                                                  selectedMealType === type
                                                    ? "default"
                                                    : "outline"
                                                }
                                                size="sm"
                                                onClick={() =>
                                                  setSelectedMealType(type)
                                                }
                                              >
                                                {type.charAt(0).toUpperCase() +
                                                  type.slice(1)}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex justify-end">
                                        <Button
                                          disabled={
                                            !selectedDay || !selectedMealType
                                          }
                                          onClick={() => {
                                            if (
                                              selectedDay &&
                                              selectedMealType
                                            ) {
                                              addToMealPlan(
                                                meal,
                                                selectedDay,
                                                selectedMealType
                                              );
                                              setSelectedDay(null);
                                              setSelectedMealType(null);
                                            }
                                          }}
                                        >
                                          Add to Plan
                                        </Button>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Educational Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-500" />
                    Nutrition Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible>
                    {nutritionTips.map((tip) => (
                      <AccordionItem key={tip.id} value={tip.id}>
                        <AccordionTrigger className="flex items-center">
                          <span className="flex items-center">
                            {tip.icon}
                            <span className="ml-2">{tip.title}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-sm text-muted-foreground">
                            {tip.content}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Meal Planning Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-violet-500" />
                    Meal Planning 101
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        Why Plan Your Meals?
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0 mt-0.5" />
                          <span>
                            Save money by reducing food waste and impulse
                            purchases
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0 mt-0.5" />
                          <span>
                            Save time by shopping efficiently and reducing daily
                            decisions
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0 mt-0.5" />
                          <span>
                            Eat healthier by making intentional food choices
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-primary/5 p-4 rounded-lg">
                      <h3 className="font-medium flex items-center text-sm">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        Getting Started
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm">
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0 mt-0.5" />
                          <span>
                            Start with planning just 3-4 days at a time
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0 mt-0.5" />
                          <span>
                            Consider your schedule - plan simpler meals for busy
                            days
                          </span>
                        </li>
                        <li className="flex items-start">
                          <ChevronRight className="h-4 w-4 mr-1 text-primary shrink-0 mt-0.5" />
                          <span>
                            Plan to use leftovers creatively to reduce cooking
                            time
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Meal Plan */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-[#0284c7]" />
                    Weekly Meal Plan
                  </CardTitle>
                  <CardDescription>
                    Plan your meals for the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue={days[0]} onValueChange={setActiveDay}>
                    <TabsList className="grid grid-cols-7">
                      {days.map((day) => (
                        <TabsTrigger
                          key={day}
                          value={day}
                          className="text-xs sm:text-sm"
                        >
                          {day.substring(0, 3)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {days.map((day) => (
                      <TabsContent key={day} value={day}>
                        <div className="space-y-4">
                          {/* Daily Nutrition Summary */}
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Card className="bg-primary/5">
                              <CardContent className="pt-6">
                                <h3 className="font-medium mb-2 flex items-center">
                                  <Flame className="h-4 w-4 mr-2 text-orange-500" />
                                  Daily Nutrition
                                </h3>
                                <div className="grid grid-cols-4 gap-2">
                                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                                    <p className="text-xs text-muted-foreground">
                                      Calories
                                    </p>
                                    <p className="font-bold">
                                      {calculateDailyNutrition(day).calories}
                                    </p>
                                  </div>
                                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                                    <p className="text-xs text-muted-foreground">
                                      Protein
                                    </p>
                                    <p className="font-bold">
                                      {calculateDailyNutrition(day).protein}g
                                    </p>
                                  </div>
                                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                                    <p className="text-xs text-muted-foreground">
                                      Carbs
                                    </p>
                                    <p className="font-bold">
                                      {calculateDailyNutrition(day).carbs}g
                                    </p>
                                  </div>
                                  <div className="text-center p-2 bg-white rounded-lg shadow-sm">
                                    <p className="text-xs text-muted-foreground">
                                      Fat
                                    </p>
                                    <p className="font-bold">
                                      {calculateDailyNutrition(day).fat}g
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Breakfast */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <Coffee className="h-5 w-5 mr-2 text-amber-600" />
                                  Breakfast
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].breakfast ? (
                                  <div className="relative">
                                    <div className="flex gap-4">
                                      <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-md">
                                        <Coffee className="h-8 w-8 text-amber-600/50" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium">
                                          {mealPlan[day].breakfast.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {mealPlan[day].breakfast.calories}{" "}
                                          calories
                                        </p>
                                        <div className="flex gap-1 mt-1">
                                          {mealPlan[day].breakfast.tags
                                            .slice(0, 2)
                                            .map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        onClick={() =>
                                          removeFromMealPlan(day, "breakfast")
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-20 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No breakfast planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Lunch */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <Sun className="h-5 w-5 mr-2 text-yellow-500" />
                                  Lunch
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].lunch ? (
                                  <div className="relative">
                                    <div className="flex gap-4">
                                      <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-md">
                                        <Sun className="h-8 w-8 text-yellow-500/50" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium">
                                          {mealPlan[day].lunch.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {mealPlan[day].lunch.calories}{" "}
                                          calories
                                        </p>
                                        <div className="flex gap-1 mt-1">
                                          {mealPlan[day].lunch.tags
                                            .slice(0, 2)
                                            .map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        onClick={() =>
                                          removeFromMealPlan(day, "lunch")
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-20 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No lunch planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Dinner */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 }}
                          >
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <Moon className="h-5 w-5 mr-2 text-blue-700" />
                                  Dinner
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].dinner ? (
                                  <div className="relative">
                                    <div className="flex gap-4">
                                      <div className="h-20 w-20 bg-muted flex items-center justify-center rounded-md">
                                        <Moon className="h-8 w-8 text-blue-700/50" />
                                      </div>
                                      <div>
                                        <h3 className="font-medium">
                                          {mealPlan[day].dinner.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                          {mealPlan[day].dinner.calories}{" "}
                                          calories
                                        </p>
                                        <div className="flex gap-1 mt-1">
                                          {mealPlan[day].dinner.tags
                                            .slice(0, 2)
                                            .map((tag) => (
                                              <Badge
                                                key={tag}
                                                variant="outline"
                                                className="text-xs"
                                              >
                                                {tag}
                                              </Badge>
                                            ))}
                                        </div>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-0 right-0"
                                        onClick={() =>
                                          removeFromMealPlan(day, "dinner")
                                        }
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-20 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No dinner planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>

                          {/* Snacks */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.4 }}
                          >
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center">
                                  <Cookie className="h-5 w-5 mr-2 text-amber-400" />
                                  Snacks
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                {mealPlan[day].snacks.length > 0 ? (
                                  <div className="space-y-3">
                                    {mealPlan[day].snacks.map(
                                      (snack, index) => (
                                        <div key={index} className="relative">
                                          <div className="flex gap-4">
                                            <div className="h-16 w-16 bg-muted flex items-center justify-center rounded-md">
                                              <Cookie className="h-6 w-6 text-amber-400/50" />
                                            </div>
                                            <div>
                                              <h3 className="font-medium text-sm">
                                                {snack.name}
                                              </h3>
                                              <p className="text-xs text-muted-foreground">
                                                {snack.calories} calories
                                              </p>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="absolute top-0 right-0"
                                              onClick={() =>
                                                removeFromMealPlan(
                                                  day,
                                                  "snacks",
                                                  index
                                                )
                                              }
                                            >
                                              <X className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-20 border border-dashed rounded-md">
                                    <p className="text-sm text-muted-foreground">
                                      No snacks planned
                                    </p>
                                  </div>
                                )}
                              </CardContent>
                            </Card>
                          </motion.div>
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={saveMealPlan}
                    disabled={savingPlan}
                  >
                    {isAuthenticated ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {savingPlan ? "Saving..." : "Save Meal Plan"}
                      </>
                    ) : (
                      "Sign In to Save"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Meal Detail Modal */}
      {selectedMeal && (
        <Dialog
          open={!!selectedMeal}
          onOpenChange={() => setSelectedMeal(null)}
        >
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMeal.name}</DialogTitle>
            </DialogHeader>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="h-64 bg-muted flex items-center justify-center rounded-lg">
                  {getMealTypeIcon(selectedMeal.category)}
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">
                    Nutrition Facts (per serving)
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm font-medium">Calories</p>
                      <p>{selectedMeal.calories}</p>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm font-medium">Protein</p>
                      <p>{selectedMeal.protein}g</p>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm font-medium">Carbs</p>
                      <p>{selectedMeal.carbs}g</p>
                    </div>
                    <div className="bg-muted p-2 rounded-md">
                      <p className="text-sm font-medium">Fat</p>
                      <p>{selectedMeal.fat}g</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {selectedMeal.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedMeal.description}
                </p>

                <h3 className="font-medium mb-2">Ingredients</h3>
                <ul className="space-y-1 mb-4">
                  {selectedMeal.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-sm">
                      • {ingredient}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Preparation Time</h3>
                  <p className="text-sm text-muted-foreground mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {selectedMeal.preparationTime} minutes
                  </p>
                </div>

                <div className="mt-6">
                  <Button
                    className="w-full"
                    onClick={() => {
                      setSelectedDay(days[0]);
                      setSelectedMealType(selectedMeal.category);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Meal Plan
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
