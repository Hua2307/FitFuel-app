import { useCallback, useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Navbar, { type TabId } from '@/components/Navbar';
import Dashboard, { type DrinkSummary } from '@/components/Dashboard';
import DrinkCalculator from '@/components/DrinkCalculator';
import MealTracker from '@/components/MealTracker';
import ExerciseTracker from '@/components/ExerciseTracker';
import ProfileSettings from '@/components/ProfileSettings';
import {
  supabase,
  type ExerciseRecord,
  type MealRecord,
  type NewExerciseInput,
  type NewMealInput,
  type ProfileUpdate,
  type UserProfile,
  type WaterRecord,
} from '@/lib/supabase';
import { WATER_GOAL_ML } from '@/lib/drinkData';

const DEFAULT_PROFILE: UserProfile = {
  id: '',
  nickname: 'FitFuel 使用者',
  gender: 'other',
  age: null,
  height_cm: null,
  weight_kg: null,
  activity_level: 'moderate',
  goal: 'maintain',
  diseases: ['none'],
  daily_calorie_goal: 2000,
  water_goal_ml: 2500,
  updated_at: '',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [exercises, setExercises] = useState<ExerciseRecord[]>([]);
  const [water, setWater] = useState<WaterRecord | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [drinkSummary, setDrinkSummary] = useState<DrinkSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toISOString().split('T')[0];

  const loadData = useCallback(async () => {
    const [mealsRes, exercisesRes, waterRes, profileRes] = await Promise.all([
      supabase.from('meal_records').select('*').eq('recorded_at', todayStr),
      supabase.from('exercise_records').select('*').eq('recorded_at', todayStr),
      supabase.from('water_records').select('*').eq('recorded_at', todayStr).maybeSingle(),
      supabase.from('user_profile').select('*').limit(1).maybeSingle(),
    ]);

    if (mealsRes.data) setMeals(mealsRes.data as MealRecord[]);
    if (exercisesRes.data) setExercises(exercisesRes.data as ExerciseRecord[]);
    setWater((waterRes.data as WaterRecord) ?? null);
    setProfile((profileRes.data as UserProfile) ?? null);
    setLoading(false);
  }, [todayStr]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- Meal handlers ---
  const handleAddMeal = async (input: NewMealInput) => {
    const { data, error } = await supabase
      .from('meal_records')
      .insert({ ...input, recorded_at: todayStr })
      .select()
      .single();
    if (error) {
      console.error('Failed to add meal:', error.message);
      return;
    }
    setMeals((prev) => [...prev, data as MealRecord]);
  };

  const handleDeleteMeal = async (id: string) => {
    setMeals((prev) => prev.filter((m) => m.id !== id));
    await supabase.from('meal_records').delete().eq('id', id);
  };

  // --- Exercise handlers ---
  const handleAddExercise = async (input: NewExerciseInput) => {
    const { data, error } = await supabase
      .from('exercise_records')
      .insert({ ...input, recorded_at: todayStr })
      .select()
      .single();
    if (error) {
      console.error('Failed to add exercise:', error.message);
      return;
    }
    setExercises((prev) => [...prev, data as ExerciseRecord]);
  };

  const handleDeleteExercise = async (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id));
    await supabase.from('exercise_records').delete().eq('id', id);
  };

  // --- Water handlers ---
  const handleAddWater = async (ml: number) => {
    const newAmount = Math.max(0, (water?.amount_ml ?? 0) + ml);
    const goal = water?.goal_ml ?? profile?.water_goal_ml ?? WATER_GOAL_ML;

    if (water) {
      const { data, error } = await supabase
        .from('water_records')
        .update({ amount_ml: newAmount })
        .eq('id', water.id)
        .select()
        .single();
      if (!error && data) setWater(data as WaterRecord);
    } else {
      const { data, error } = await supabase
        .from('water_records')
        .insert({ amount_ml: newAmount, goal_ml: goal, recorded_at: todayStr })
        .select()
        .single();
      if (!error && data) setWater(data as WaterRecord);
    }
  };

  const handleSetWaterGoal = async (goal: number) => {
    if (water) {
      const { data, error } = await supabase
        .from('water_records')
        .update({ goal_ml: goal })
        .eq('id', water.id)
        .select()
        .single();
      if (!error && data) setWater(data as WaterRecord);
    } else {
      const { data, error } = await supabase
        .from('water_records')
        .insert({ amount_ml: 0, goal_ml: goal, recorded_at: todayStr })
        .select()
        .single();
      if (!error && data) setWater(data as WaterRecord);
    }
  };

  // --- Profile handler ---
  const handleSaveProfile = async (update: ProfileUpdate) => {
    if (profile) {
      const { data, error } = await supabase
        .from('user_profile')
        .update(update)
        .eq('id', profile.id)
        .select()
        .single();
      if (!error && data) setProfile(data as UserProfile);
    } else {
      const { data, error } = await supabase
        .from('user_profile')
        .insert(update)
        .select()
        .single();
      if (!error && data) setProfile(data as UserProfile);
    }
  };

  // Stable callback for drink summary
  const handleSummaryChange = useCallback((summary: DrinkSummary | null) => {
    setDrinkSummary(summary);
  }, []);

  const activeProfile = profile ?? DEFAULT_PROFILE;
  const avatarInitials = activeProfile.nickname.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar avatarInitials={avatarInitials} activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                meals={meals}
                exercises={exercises}
                water={water}
                profile={profile}
                drinkSummary={drinkSummary}
                onAddWater={handleAddWater}
                onSetWaterGoal={handleSetWaterGoal}
              />
            )}
            {activeTab === 'meal' && (
              <MealTracker
                meals={meals}
                onAddMeal={handleAddMeal}
                onDeleteMeal={handleDeleteMeal}
              />
            )}
            {activeTab === 'exercise' && (
              <ExerciseTracker
                exercises={exercises}
                onAddExercise={handleAddExercise}
                onDeleteExercise={handleDeleteExercise}
              />
            )}
            {activeTab === 'drink' && (
              <DrinkCalculator onSummaryChange={handleSummaryChange} />
            )}
            {activeTab === 'settings' && (
              <ProfileSettings profile={activeProfile} onSave={handleSaveProfile} />
            )}
          </>
        )}

        <footer className="mt-16 border-t border-slate-200 pt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
            <Heart className="h-4 w-4 text-primary-400" />
            <span className="font-medium">FitFuel — 為增肌減脂者打造的健康管理系統</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            熱量與運動換算為估算值，實際數據因個人體質而異
          </p>
        </footer>
      </main>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="shimmer-bg h-64 animate-shimmer rounded-3xl" />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="shimmer-bg h-48 animate-shimmer rounded-2xl lg:col-span-2" />
        <div className="shimmer-bg h-48 animate-shimmer rounded-2xl" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="shimmer-bg h-64 animate-shimmer rounded-2xl" />
        <div className="shimmer-bg h-64 animate-shimmer rounded-2xl" />
      </div>
    </div>
  );
}
