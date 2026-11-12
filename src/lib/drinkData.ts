import type { ActivityLevel, FitnessGoal, Gender, UserProfile } from '@/lib/supabase';

export interface DrinkBase {
  id: string;
  name: string;
  emoji: string;
  baseCalories: number;
  baseSugarGrams: number;
  sizes: { label: string; ml: number; calorieFactor: number }[];
  sugarLevels: { label: string; sugarGrams: number }[];
}

export interface Topping {
  id: string;
  name: string;
  emoji: string;
  calories: number;
  sugarGrams: number;
}

export const DRINK_BASES: DrinkBase[] = [
  {
    id: 'bubble-milk-tea',
    name: '珍珠奶茶',
    emoji: '🧋',
    baseCalories: 160,
    baseSugarGrams: 28,
    sizes: [
      { label: '中杯 500ml', ml: 500, calorieFactor: 1 },
      { label: '大杯 700ml', ml: 700, calorieFactor: 1.4 },
    ],
    sugarLevels: [
      { label: '正常糖', sugarGrams: 28 },
      { label: '少糖', sugarGrams: 20 },
      { label: '半糖', sugarGrams: 14 },
      { label: '微糖', sugarGrams: 8 },
      { label: '無糖', sugarGrams: 0 },
    ],
  },
  {
    id: 'four-seasons-tea',
    name: '四季春茶',
    emoji: '🍵',
    baseCalories: 60,
    baseSugarGrams: 18,
    sizes: [
      { label: '中杯 500ml', ml: 500, calorieFactor: 1 },
      { label: '大杯 700ml', ml: 700, calorieFactor: 1.4 },
    ],
    sugarLevels: [
      { label: '正常糖', sugarGrams: 18 },
      { label: '少糖', sugarGrams: 12 },
      { label: '半糖', sugarGrams: 8 },
      { label: '微糖', sugarGrams: 4 },
      { label: '無糖', sugarGrams: 0 },
    ],
  },
  {
    id: 'oolong-latte',
    name: '烏龍拿鐵',
    emoji: '🥛',
    baseCalories: 120,
    baseSugarGrams: 22,
    sizes: [
      { label: '中杯 500ml', ml: 500, calorieFactor: 1 },
      { label: '大杯 700ml', ml: 700, calorieFactor: 1.4 },
    ],
    sugarLevels: [
      { label: '正常糖', sugarGrams: 22 },
      { label: '少糖', sugarGrams: 15 },
      { label: '半糖', sugarGrams: 11 },
      { label: '微糖', sugarGrams: 6 },
      { label: '無糖', sugarGrams: 0 },
    ],
  },
  {
    id: 'fruit-tea',
    name: '水果茶',
    emoji: '🥤',
    baseCalories: 140,
    baseSugarGrams: 32,
    sizes: [
      { label: '中杯 500ml', ml: 500, calorieFactor: 1 },
      { label: '大杯 700ml', ml: 700, calorieFactor: 1.4 },
    ],
    sugarLevels: [
      { label: '正常糖', sugarGrams: 32 },
      { label: '少糖', sugarGrams: 22 },
      { label: '半糖', sugarGrams: 16 },
      { label: '微糖', sugarGrams: 8 },
      { label: '無糖', sugarGrams: 0 },
    ],
  },
  {
    id: 'matcha-latte',
    name: '抹茶拿鐵',
    emoji: '🍧',
    baseCalories: 180,
    baseSugarGrams: 26,
    sizes: [
      { label: '中杯 500ml', ml: 500, calorieFactor: 1 },
      { label: '大杯 700ml', ml: 700, calorieFactor: 1.4 },
    ],
    sugarLevels: [
      { label: '正常糖', sugarGrams: 26 },
      { label: '少糖', sugarGrams: 18 },
      { label: '半糖', sugarGrams: 13 },
      { label: '微糖', sugarGrams: 7 },
      { label: '無糖', sugarGrams: 0 },
    ],
  },
  {
    id: 'lemon-ade',
    name: '檸檬冰茶',
    emoji: '🍋',
    baseCalories: 90,
    baseSugarGrams: 24,
    sizes: [
      { label: '中杯 500ml', ml: 500, calorieFactor: 1 },
      { label: '大杯 700ml', ml: 700, calorieFactor: 1.4 },
    ],
    sugarLevels: [
      { label: '正常糖', sugarGrams: 24 },
      { label: '少糖', sugarGrams: 16 },
      { label: '半糖', sugarGrams: 12 },
      { label: '微糖', sugarGrams: 6 },
      { label: '無糖', sugarGrams: 0 },
    ],
  },
];

export const TOPPINGS: Topping[] = [
  { id: 'tapioca', name: '珍珠', emoji: '⚫', calories: 160, sugarGrams: 14 },
  { id: 'coconut-jelly', name: '椰果', emoji: '🟦', calories: 80, sugarGrams: 8 },
  { id: 'grass-jelly', name: '仙草', emoji: '🟫', calories: 40, sugarGrams: 4 },
  { id: 'aloe', name: '蘆薈', emoji: '🟩', calories: 50, sugarGrams: 10 },
  { id: 'pudding', name: '布丁', emoji: '🟡', calories: 110, sugarGrams: 12 },
  { id: 'none', name: '不加配料', emoji: '✖️', calories: 0, sugarGrams: 0 },
];

/** MET-based calorie burn estimates (kcal per minute for a 65kg adult) */
export const EXERCISE_METRICS = {
  jogging: { label: '慢跑', kcalPerMin: 8.3 },
  gym: { label: '健身重訓', kcalPerMin: 6.0 },
  cycling: { label: '騎自行車', kcalPerMin: 7.5 },
  swimming: { label: '游泳', kcalPerMin: 9.8 },
  walking: { label: '快走', kcalPerMin: 4.3 },
  jumping: { label: '跳繩', kcalPerMin: 11.0 },
};

export const SUGAR_DAILY_LIMIT = 50; // WHO suggested daily added sugar limit (grams)

export const WATER_GOAL_ML = 2500;
export const DAILY_CALORIE_GOAL = 2000;
export const MACRO_GOALS = { protein: 130, carbs: 250, fat: 65 };

// --- Health calculation utilities ---

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUST: Record<FitnessGoal, number> = {
  lose_fat: 0.8,
  build_muscle: 1.1,
  maintain: 1.0,
};

/** Mifflin-St Jeor BMR formula */
export function calculateBMR(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') return Math.round(base + 5);
  if (gender === 'female') return Math.round(base - 161);
  return Math.round(base - 78);
}

/** TDEE = BMR * activity factor * goal adjustment */
export function calculateTDEE(profile: UserProfile): number {
  if (!profile.height_cm || !profile.weight_kg || !profile.age) {
    return DAILY_CALORIE_GOAL;
  }
  const bmr = calculateBMR(profile.gender, Number(profile.weight_kg), Number(profile.height_cm), profile.age);
  const tdee = Math.round(bmr * ACTIVITY_FACTORS[profile.activity_level] * GOAL_ADJUST[profile.goal]);
  return tdee;
}

export function calculateBMI(heightCm: number | null, weightKg: number | null): number | null {
  if (!heightCm || !weightKg || heightCm <= 0) return null;
  const h = Number(heightCm) / 100;
  return Math.round((Number(weightKg) / (h * h)) * 10) / 10;
}

export function bmiCategory(bmi: number): { label: string; color: string } {
  if (bmi < 18.5) return { label: '體重過輕', color: 'text-secondary-600' };
  if (bmi < 24) return { label: '健康範圍', color: 'text-success-600' };
  if (bmi < 27) return { label: '過重', color: 'text-accent-600' };
  if (bmi < 30) return { label: '輕度肥胖', color: 'text-warning-600' };
  return { label: '中度肥胖', color: 'text-error-600' };
}

export function calculateMacroGoals(calorieGoal: number) {
  return {
    protein: Math.round((calorieGoal * 0.3) / 4),
    carbs: Math.round((calorieGoal * 0.45) / 4),
    fat: Math.round((calorieGoal * 0.25) / 9),
  };
}

export const DISEASE_OPTIONS = [
  { id: 'none', label: '無' },
  { id: 'diabetes', label: '糖尿病' },
  { id: 'hypertension', label: '高血壓' },
  { id: 'hyperlipidemia', label: '高血脂' },
  { id: 'fatty_liver', label: '脂肪肝' },
  { id: 'gout', label: '痛風' },
  { id: 'kidney', label: '腎臟疾病' },
];

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: '久坐不動',
  light: '輕度活動',
  moderate: '中度活動',
  active: '高度活動',
  very_active: '非常活躍',
};

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_fat: '減脂',
  build_muscle: '增肌',
  maintain: '維持體態',
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: '男性',
  female: '女性',
  other: '其他',
};
