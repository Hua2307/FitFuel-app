import {
  Apple,
  MinusCircle,
  Moon,
  Plus,
  Soup,
  Sun,
  Sunrise,
} from 'lucide-react';
import { useState } from 'react';
import type {
  MealRecord,
  MealType,
  NewMealInput,
} from '@/lib/supabase';

interface MealTrackerProps {
  meals: MealRecord[];
  onAddMeal: (input: NewMealInput) => void;
  onDeleteMeal: (id: string) => void;
}

const MEAL_TYPES: { value: MealType; label: string; icon: typeof Sunrise }[] = [
  { value: 'breakfast', label: '早餐', icon: Sunrise },
  { value: 'lunch', label: '午餐', icon: Sun },
  { value: 'dinner', label: '晚餐', icon: Moon },
  { value: 'snack', label: '點心', icon: Soup },
];

const todayStr = () => new Date().toISOString().split('T')[0];

export default function MealTracker({ meals, onAddMeal, onDeleteMeal }: MealTrackerProps) {
  const [activeMealType, setActiveMealType] = useState<MealType>('breakfast');
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [mealProtein, setMealProtein] = useState('');
  const [mealCarbs, setMealCarbs] = useState('');
  const [mealFat, setMealFat] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const todaysMeals = meals.filter((m) => m.recorded_at === todayStr());

  const handleSubmit = () => {
    if (!mealName.trim() || !mealCalories) return;
    setSubmitting(true);
    onAddMeal({
      meal_type: activeMealType,
      name: mealName.trim(),
      calories: parseInt(mealCalories) || 0,
      protein: parseFloat(mealProtein) || 0,
      carbs: parseFloat(mealCarbs) || 0,
      fat: parseFloat(mealFat) || 0,
    });
    setMealName('');
    setMealCalories('');
    setMealProtein('');
    setMealCarbs('');
    setMealFat('');
    setSubmitting(false);
  };

  return (
    <section className="space-y-6">
      <div className="mb-2">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
          <Apple className="h-6 w-6 text-primary-600" />
          飲食紀錄
        </h2>
        <p className="mt-1 text-sm text-slate-500">新增今日餐點與營養素，自動同步至儀表板</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">新增飲食</h3>

          <div className="mb-4 grid grid-cols-4 gap-2">
            {MEAL_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setActiveMealType(value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl border-2 px-2 py-2.5 text-xs font-semibold transition-all ${
                  activeMealType === value
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            <Field label="食物名稱">
              <input
                type="text"
                value={mealName}
                onChange={(e) => setMealName(e.target.value)}
                placeholder="例如：雞胸肉便當"
                className="input"
              />
            </Field>

            <Field label="熱量 (kcal)">
              <input
                type="number"
                value={mealCalories}
                onChange={(e) => setMealCalories(e.target.value)}
                placeholder="例如：550"
                className="input"
              />
            </Field>

            <div className="grid grid-cols-3 gap-2">
              <Field label="蛋白質 (g)">
                <input
                  type="number"
                  value={mealProtein}
                  onChange={(e) => setMealProtein(e.target.value)}
                  placeholder="35"
                  className="input"
                />
              </Field>
              <Field label="碳水 (g)">
                <input
                  type="number"
                  value={mealCarbs}
                  onChange={(e) => setMealCarbs(e.target.value)}
                  placeholder="60"
                  className="input"
                />
              </Field>
              <Field label="脂肪 (g)">
                <input
                  type="number"
                  value={mealFat}
                  onChange={(e) => setMealFat(e.target.value)}
                  placeholder="15"
                  className="input"
                />
              </Field>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !mealName.trim() || !mealCalories}
              className="w-full rounded-xl gradient-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="mr-1 inline h-4 w-4" />新增{MEAL_TYPES.find((m) => m.value === activeMealType)?.label}
            </button>
          </div>
        </div>

        {/* Records list */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">今日飲食紀錄</h3>
            <span className="rounded-full bg-primary-50 px-3 py-0.5 text-xs font-bold text-primary-700">
              {todaysMeals.length} 筆
            </span>
          </div>

          {todaysMeals.length === 0 ? (
            <EmptyState text="今日尚無飲食紀錄" icon={Soup} />
          ) : (
            <div className="space-y-2">
              {todaysMeals
                .sort((a, b) => b.created_at.localeCompare(a.created_at))
                .map((meal) => {
                  const typeInfo = MEAL_TYPES.find((m) => m.value === meal.meal_type);
                  return (
                    <div
                      key={meal.id}
                      className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-100">
                        {typeInfo && <typeInfo.icon className="h-5 w-5 text-primary-600" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-bold text-slate-800">{meal.name}</span>
                          <span className="shrink-0 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
                            {typeInfo?.label}
                          </span>
                        </div>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">{meal.calories} kcal</span>
                          <span>P {meal.protein}g</span>
                          <span>C {meal.carbs}g</span>
                          <span>F {meal.fat}g</span>
                        </div>
                      </div>
                      <button
                        onClick={() => onDeleteMeal(meal.id)}
                        className="shrink-0 text-slate-300 transition-colors hover:text-error-500"
                        aria-label="刪除"
                      >
                        <MinusCircle className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-slate-500">{label}</label>
      {children}
    </div>
  );
}

function EmptyState({ text, icon: Icon }: { text: string; icon: typeof Soup }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-300" />
      </div>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}
