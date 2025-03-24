"use client";
// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Heart,
  Moon,
  Activity,
  Apple,
  ArrowLeft,
  Plus,
  Trash2,
  Target,
  Trophy,
  TrendingUp,
  Scale,
  Calendar,
  Droplets,
  Brain,
  Dumbbell,
  Flame,
  Utensils,
  Bike,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  orderBy,
  limit,
} from "firebase/firestore";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HealthData {
  heartRate: number;
  sleepHours: number;
  waterIntake: number;
  steps: number;
  weight: number;
  mood: string;
  stressLevel: number;
  exerciseMinutes: number;
  caloriesBurned: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  meals: Meal[];
  meditation: number;
  date: Date;
}

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export default function HealthTracker() {
  const { toast } = useToast();
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    sleepHours: 7.5,
    waterIntake: 4,
    steps: 8000,
    weight: 70,
    mood: "good",
    stressLevel: 3,
    exerciseMinutes: 30,
    caloriesBurned: 300,
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
    },
    meditation: 15,
    meals: [
      {
        id: 1,
        name: "Breakfast",
        calories: 400,
        protein: 20,
        carbs: 45,
        fat: 15,
        time: "08:00",
      },
      {
        id: 2,
        name: "Lunch",
        calories: 600,
        protein: 30,
        carbs: 65,
        fat: 20,
        time: "13:00",
      },
    ],
    date: new Date(),
  });

  const [historicalData, setHistoricalData] = useState<HealthData[]>([]);
  const [streaks, setStreaks] = useState({
    steps: 0,
    sleep: 0,
    water: 0,
    meditation: 0,
  });
  const [goals, setGoals] = useState({
    steps: 10000,
    sleep: 8,
    water: 8,
    weight: 70,
    exerciseMinutes: 45,
    meditation: 20,
  });

  useEffect(() => {
    loadHistoricalData();
  }, []);

  const loadHistoricalData = async () => {
    if (!auth.currentUser) return;

    const healthRef = collection(db, "health_records");
    const q = query(
      healthRef,
      where("userId", "==", auth.currentUser.uid),
      orderBy("date", "desc"),
      limit(7)
    );

    try {
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            date: doc.data().date.toDate(),
          } as HealthData)
      );
      setHistoricalData(data);
      calculateStreaks(data);
    } catch (error) {
      console.error("Error loading historical data:", error);
    }
  };

  const saveHealthData = async () => {
    if (!auth.currentUser) {
      toast({
        title: "Error",
        description: "Please sign in to save your data",
        variant: "destructive",
      });
      return;
    }

    try {
      await addDoc(collection(db, "health_records"), {
        ...healthData,
        userId: auth.currentUser.uid,
        date: Timestamp.fromDate(new Date()),
      });

      toast({
        title: "Success",
        description: "Health data saved successfully!",
      });

      loadHistoricalData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save health data",
        variant: "destructive",
      });
    }
  };

  const calculateStreaks = (data: HealthData[]) => {
    let stepStreak = 0;
    let sleepStreak = 0;
    let waterStreak = 0;
    let meditationStreak = 0;

    for (const record of data) {
      if (record.steps >= goals.steps) stepStreak++;
      else break;
    }

    for (const record of data) {
      if (record.sleepHours >= goals.sleep) sleepStreak++;
      else break;
    }

    for (const record of data) {
      if (record.waterIntake >= goals.water) waterStreak++;
      else break;
    }

    for (const record of data) {
      if (record.meditation >= goals.meditation) meditationStreak++;
      else break;
    }

    setStreaks({
      steps: stepStreak,
      sleep: sleepStreak,
      water: waterStreak,
      meditation: meditationStreak,
    });
  };

  const getHealthScore = () => {
    let score = 0;
    if (healthData.steps >= goals.steps) score += 20;
    if (healthData.sleepHours >= goals.sleep) score += 20;
    if (healthData.waterIntake >= goals.water) score += 15;
    if (healthData.heartRate >= 60 && healthData.heartRate <= 100) score += 15;
    if (healthData.exerciseMinutes >= goals.exerciseMinutes) score += 15;
    if (healthData.meditation >= goals.meditation) score += 15;
    return score;
  };

  const getStressLevel = () => {
    const level = healthData.stressLevel;
    if (level <= 2) return { text: "Low", color: "text-green-500" };
    if (level <= 4) return { text: "Moderate", color: "text-yellow-500" };
    return { text: "High", color: "text-red-500" };
  };

  const chartData = {
    labels: historicalData
      .map((d) => format(new Date(d.date), "MMM dd"))
      .reverse(),
    datasets: [
      {
        label: "Steps",
        data: historicalData.map((d) => d.steps).reverse(),
        borderColor: "hsl(var(--chart-1))",
        tension: 0.1,
      },
      {
        label: "Sleep Hours",
        data: historicalData.map((d) => d.sleepHours).reverse(),
        borderColor: "hsl(var(--chart-2))",
        tension: 0.1,
      },
      {
        label: "Exercise Minutes",
        data: historicalData.map((d) => d.exerciseMinutes).reverse(),
        borderColor: "hsl(var(--chart-3))",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-primary">
              Holistic Health Dashboard
            </h1>
            <p className="text-muted-foreground">
              Your wellness score today: {getHealthScore()}%
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={saveHealthData}
              className="bg-primary hover:bg-primary/90"
            >
              Save Today's Data
            </Button>
            <Link href="/">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <Tabs defaultValue="tracking" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="tracking">Daily Tracking</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="goals">Goals & Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="tracking" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <Heart className="h-8 w-8 text-red-500" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">Vitals</h2>
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Heart Rate
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.heartRate}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                heartRate: Number(e.target.value),
                              })
                            }
                            className="w-20"
                          />
                          <span>bpm</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Blood Pressure
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.bloodPressure.systolic}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                bloodPressure: {
                                  ...healthData.bloodPressure,
                                  systolic: Number(e.target.value),
                                },
                              })
                            }
                            className="w-20"
                          />
                          <span>/</span>
                          <Input
                            type="number"
                            value={healthData.bloodPressure.diastolic}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                bloodPressure: {
                                  ...healthData.bloodPressure,
                                  diastolic: Number(e.target.value),
                                },
                              })
                            }
                            className="w-20"
                          />
                          <span>mmHg</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <Activity className="h-8 w-8 text-emerald-500" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">Activity</h2>
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Steps
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.steps}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                steps: Number(e.target.value),
                              })
                            }
                            className="w-24"
                          />
                          <Progress
                            value={(healthData.steps / goals.steps) * 100}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Exercise Minutes
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.exerciseMinutes}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                exerciseMinutes: Number(e.target.value),
                              })
                            }
                            className="w-20"
                          />
                          <span>min</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Calories Burned
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.caloriesBurned}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                caloriesBurned: Number(e.target.value),
                              })
                            }
                            className="w-20"
                          />
                          <span>kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <Brain className="h-8 w-8 text-purple-500" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">Mental Wellness</h2>
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Stress Level (1-5)
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.stressLevel}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                stressLevel: Number(e.target.value),
                              })
                            }
                            min="1"
                            max="5"
                            className="w-20"
                          />
                          <span className={getStressLevel().color}>
                            {getStressLevel().text}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Meditation
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.meditation}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                meditation: Number(e.target.value),
                              })
                            }
                            className="w-20"
                          />
                          <span>min</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <Moon className="h-8 w-8 text-blue-500" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">Sleep & Rest</h2>
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Sleep Duration
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.sleepHours}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                sleepHours: Number(e.target.value),
                              })
                            }
                            step="0.5"
                            className="w-20"
                          />
                          <span>hours</span>
                        </div>
                      </div>
                      <Progress
                        value={(healthData.sleepHours / goals.sleep) * 100}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <Droplets className="h-8 w-8 text-cyan-500" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">Hydration</h2>
                    <div className="space-y-3 mt-4">
                      <div>
                        <label className="text-sm text-muted-foreground">
                          Water Intake
                        </label>
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={healthData.waterIntake}
                            onChange={(e) =>
                              setHealthData({
                                ...healthData,
                                waterIntake: Number(e.target.value),
                              })
                            }
                            className="w-20"
                          />
                          <span>glasses</span>
                        </div>
                      </div>
                      <Progress
                        value={(healthData.waterIntake / goals.water) * 100}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                  <Utensils className="h-8 w-8 text-orange-500" />
                  <div className="flex-1">
                    <h2 className="text-2xl font-semibold">Nutrition</h2>
                    <div className="space-y-4 mt-4">
                      {healthData.meals.map((meal, index) => (
                        <div key={meal.id} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <input
                              type="text"
                              value={meal.name}
                              onChange={(e) => {
                                const newMeals = [...healthData.meals];
                                newMeals[index] = {
                                  ...meal,
                                  name: e.target.value,
                                };
                                setHealthData({
                                  ...healthData,
                                  meals: newMeals,
                                });
                              }}
                              className="text-sm font-medium bg-transparent border-none focus:outline-none"
                            />
                            <input
                              type="time"
                              value={meal.time}
                              onChange={(e) => {
                                const newMeals = [...healthData.meals];
                                newMeals[index] = {
                                  ...meal,
                                  time: e.target.value,
                                };
                                setHealthData({
                                  ...healthData,
                                  meals: newMeals,
                                });
                              }}
                              className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            <div>
                              <Input
                                type="number"
                                value={meal.calories}
                                onChange={(e) => {
                                  const newMeals = [...healthData.meals];
                                  newMeals[index] = {
                                    ...meal,
                                    calories: Number(e.target.value),
                                  };
                                  setHealthData({
                                    ...healthData,
                                    meals: newMeals,
                                  });
                                }}
                                className="w-full"
                                placeholder="kcal"
                              />
                              <span className="text-xs text-muted-foreground">
                                kcal
                              </span>
                            </div>
                            <div>
                              <Input
                                type="number"
                                value={meal.protein}
                                onChange={(e) => {
                                  const newMeals = [...healthData.meals];
                                  newMeals[index] = {
                                    ...meal,
                                    protein: Number(e.target.value),
                                  };
                                  setHealthData({
                                    ...healthData,
                                    meals: newMeals,
                                  });
                                }}
                                className="w-full"
                                placeholder="protein"
                              />
                              <span className="text-xs text-muted-foreground">
                                g protein
                              </span>
                            </div>
                            <div>
                              <Input
                                type="number"
                                value={meal.carbs}
                                onChange={(e) => {
                                  const newMeals = [...healthData.meals];
                                  newMeals[index] = {
                                    ...meal,
                                    carbs: Number(e.target.value),
                                  };
                                  setHealthData({
                                    ...healthData,
                                    meals: newMeals,
                                  });
                                }}
                                className="w-full"
                                placeholder="carbs"
                              />
                              <span className="text-xs text-muted-foreground">
                                g carbs
                              </span>
                            </div>
                            <div>
                              <Input
                                type="number"
                                value={meal.fat}
                                onChange={(e) => {
                                  const newMeals = [...healthData.meals];
                                  newMeals[index] = {
                                    ...meal,
                                    fat: Number(e.target.value),
                                  };
                                  setHealthData({
                                    ...healthData,
                                    meals: newMeals,
                                  });
                                }}
                                className="w-full"
                                placeholder="fat"
                              />
                              <span className="text-xs text-muted-foreground">
                                g fat
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          const newMeal = {
                            id: Date.now(),
                            name: "New Meal",
                            calories: 0,
                            protein: 0,
                            carbs: 0,
                            fat: 0,
                            time: "12:00",
                          };
                          setHealthData({
                            ...healthData,
                            meals: [...healthData.meals, newMeal],
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Meal
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Weekly Progress</h3>
              <div className="h-[400px]">
                <Line
                  data={chartData}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Step Streak</h3>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">
                    {streaks.steps} days
                  </span>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Sleep Streak</h3>
                <div className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">
                    {streaks.sleep} days
                  </span>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">Water Streak</h3>
                <div className="flex items-center space-x-2">
                  <Droplets className="h-5 w-5 text-cyan-500" />
                  <span className="text-2xl font-bold">
                    {streaks.water} days
                  </span>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-2">
                  Meditation Streak
                </h3>
                <div className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  <span className="text-2xl font-bold">
                    {streaks.meditation} days
                  </span>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Daily Goals</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Steps Target</label>
                    <Input
                      type="number"
                      value={goals.steps}
                      onChange={(e) =>
                        setGoals({ ...goals, steps: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Sleep Hours</label>
                    <Input
                      type="number"
                      value={goals.sleep}
                      onChange={(e) =>
                        setGoals({ ...goals, sleep: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Water Glasses</label>
                    <Input
                      type="number"
                      value={goals.water}
                      onChange={(e) =>
                        setGoals({ ...goals, water: Number(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Exercise Minutes
                    </label>
                    <Input
                      type="number"
                      value={goals.exerciseMinutes}
                      onChange={(e) =>
                        setGoals({
                          ...goals,
                          exerciseMinutes: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      Meditation Minutes
                    </label>
                    <Input
                      type="number"
                      value={goals.meditation}
                      onChange={(e) =>
                        setGoals({
                          ...goals,
                          meditation: Number(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Achievements</h3>
                <div className="space-y-4">
                  {streaks.steps >= 7 && (
                    <div className="flex items-center space-x-3 p-3 bg-yellow-500/10 rounded-lg">
                      <Trophy className="h-6 w-6 text-yellow-500" />
                      <span>Week Warrior: 7-day step goal streak!</span>
                    </div>
                  )}
                  {streaks.sleep >= 5 && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-500/10 rounded-lg">
                      <Moon className="h-6 w-6 text-blue-500" />
                      <span>Sleep Master: 5-day sleep goal streak!</span>
                    </div>
                  )}
                  {streaks.meditation >= 3 && (
                    <div className="flex items-center space-x-3 p-3 bg-purple-500/10 rounded-lg">
                      <Brain className="h-6 w-6 text-purple-500" />
                      <span>Zen Master: 3-day meditation streak!</span>
                    </div>
                  )}
                  {getHealthScore() >= 90 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-500/10 rounded-lg">
                      <Target className="h-6 w-6 text-green-500" />
                      <span>Health Champion: 90+ wellness score!</span>
                    </div>
                  )}
                  {healthData.exerciseMinutes >=
                    goals.exerciseMinutes * 1.5 && (
                    <div className="flex items-center space-x-3 p-3 bg-emerald-500/10 rounded-lg">
                      <Dumbbell className="h-6 w-6 text-emerald-500" />
                      <span>
                        Exercise Enthusiast: Exceeded exercise goal by 50%!
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
