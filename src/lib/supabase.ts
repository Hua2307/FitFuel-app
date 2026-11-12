import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface MealRecord {
  id: string;
  meal_type: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  recorded_at: string;
  created_at: string;
}

export interface ExerciseRecord {
  id: string;
  name: string;
  calories_burned: number;
  duration_min: number;
  recorded_at: string;
  created_at: string;
}

export interface WaterRecord {
  id: string;
  amount_ml: number;
  goal_ml: number;
  recorded_at: string;
  created_at: string;
}

export type Gender = 'male' | 'female' | 'other';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type FitnessGoal = 'lose_fat' | 'build_muscle' | 'maintain';

export interface UserProfile {
  id: string;
  nickname: string;
  gender: Gender;
  age: number | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: ActivityLevel;
  goal: FitnessGoal;
  diseases: string[];
  daily_calorie_goal: number;
  water_goal_ml: number;
  updated_at: string;
}

export interface NewMealInput {
  meal_type: MealType;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface NewExerciseInput {
  name: string;
  calories_burned: number;
  duration_min: number;
}

export interface ProfileUpdate {
  nickname?: string;
  gender?: Gender;
  age?: number | null;
  height_cm?: number | null;
  weight_kg?: number | null;
  activity_level?: ActivityLevel;
  goal?: FitnessGoal;
  diseases?: string[];
  daily_calorie_goal?: number;
  water_goal_ml?: number;
}
