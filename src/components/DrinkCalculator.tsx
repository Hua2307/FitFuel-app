import {
  AlertTriangle,
  Beef,
  CheckCircle2,
  Dumbbell,
  Footprints,
  Heart,
  Info,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  DRINK_BASES,
  EXERCISE_METRICS,
  SUGAR_DAILY_LIMIT,
  TOPPINGS,
} from '@/lib/drinkData';
import type { DrinkSummary } from '@/components/Dashboard';

interface DrinkCalculatorProps {
  onSummaryChange: (summary: DrinkSummary | null) => void;
}

export default function DrinkCalculator({ onSummaryChange }: DrinkCalculatorProps) {
  const [drinkIdx, setDrinkIdx] = useState(0);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [sugarIdx, setSugarIdx] = useState(0);
  const [toppingIds, setToppingIds] = useState<string[]>([]);

  const drink = DRINK_BASES[drinkIdx];
  const size = drink.sizes[sizeIdx];
  const sugarLevel = drink.sugarLevels[sugarIdx];
  const selectedToppings = TOPPINGS.filter((t) => toppingIds.includes(t.id) && t.id !== 'none');

  const { totalCalories, totalSugar, drinkCalories } = useMemo(() => {
    const dCal = Math.round(drink.baseCalories * size.calorieFactor);
    const tCal = selectedToppings.reduce((s, t) => s + t.calories, 0);
    const dSugar = sugarLevel.sugarGrams;
    const tSugar = selectedToppings.reduce((s, t) => s + t.sugarGrams, 0);
    return {
      totalCalories: dCal + tCal,
      totalSugar: dSugar + tSugar,
      drinkCalories: dCal,
    };
  }, [drink, size, sugarLevel, selectedToppings]);

  const sugarPct = Math.min(100, (totalSugar / SUGAR_DAILY_LIMIT) * 100);
  const sugarOver = totalSugar > SUGAR_DAILY_LIMIT;

  // Lift summary up to parent for dashboard integration
  useMemo(() => {
    onSummaryChange({
      emoji: drink.emoji,
      name: drink.name,
      totalCalories,
      totalSugar,
      sugarOver,
    });
  }, [drink, totalCalories, totalSugar, sugarOver, onSummaryChange]);

  const exerciseMinutes = useMemo(() => {
    return Object.entries(EXERCISE_METRICS).map(([key, info]) => ({
      key,
      ...info,
      minutes: Math.ceil(totalCalories / info.kcalPerMin),
    }));
  }, [totalCalories]);

  const toggleTopping = (id: string) => {
    if (id === 'none') {
      setToppingIds([]);
      return;
    }
    setToppingIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const topExercise = exerciseMinutes[0];

  return (
    <section className="space-y-6">
      <div className="mb-2">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
          <span className="text-2xl">🧋</span>
          手搖飲控糖與運動換算
        </h2>
        <p className="mt-1 text-sm text-slate-500">選擇飲品、甜度與配料，即時計算熱量、糖分與所需運動量</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* Selection panel */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          {/* Drink selection */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">選擇飲品</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {DRINK_BASES.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDrinkIdx(i);
                    setSizeIdx(0);
                    setSugarIdx(0);
                  }}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                    i === drinkIdx
                      ? 'border-primary-500 bg-primary-50 text-primary-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="text-lg">{d.emoji}</span>
                  {d.name}
                </button>
              ))}
            </div>
          </div>

          {/* Size selection */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">杯型</label>
            <div className="flex gap-2">
              {drink.sizes.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setSizeIdx(i)}
                  className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                    i === sizeIdx
                      ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sugar level */}
          <div className="mb-5">
            <label className="mb-2 block text-sm font-bold text-slate-700">甜度</label>
            <div className="flex flex-wrap gap-2">
              {drink.sugarLevels.map((s, i) => (
                <button
                  key={s.label}
                  onClick={() => setSugarIdx(i)}
                  className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all ${
                    i === sugarIdx
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {s.label}
                  <span className="ml-1 text-xs opacity-60">{s.sugarGrams}g</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">配料（可複選）</label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {TOPPINGS.map((t) => {
                const active = t.id === 'none' ? toppingIds.length === 0 : toppingIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.id)}
                    className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                      active
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-base">{t.emoji}</span>
                    <div className="flex flex-col">
                      <span>{t.name}</span>
                      {t.calories > 0 && (
                        <span className="text-[10px] font-medium opacity-60">+{t.calories}kcal</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result panel */}
        <div className="flex flex-col gap-4">
          {/* Calorie + sugar breakdown */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">熱量與糖分拆解</h3>

            <div className="mb-4 flex items-center justify-between rounded-xl bg-slate-50 p-4">
              <div>
                <div className="text-xs font-medium text-slate-500">總熱量</div>
                <div className="text-3xl font-extrabold text-slate-900">{totalCalories}</div>
                <div className="text-xs font-medium text-slate-400">kcal</div>
              </div>
              <div className="text-3xl">{drink.emoji}</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-500">飲品本體</span>
                <span className="font-bold text-slate-700">{drinkCalories} kcal</span>
              </div>
              {selectedToppings.map((t) => (
                <div key={t.id} className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-slate-500">{t.emoji} {t.name}</span>
                  <span className="font-bold text-slate-700">+{t.calories} kcal</span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-1">
                <span className="flex items-center gap-1.5 text-slate-500">
                  <Beef className="h-3.5 w-3.5" />糖分
                </span>
                <span className={`font-bold ${sugarOver ? 'text-error-600' : 'text-slate-700'}`}>
                  {totalSugar}g
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">每日糖分建議上限 {SUGAR_DAILY_LIMIT}g</span>
                <span className={`font-bold ${sugarOver ? 'text-error-600' : 'text-slate-600'}`}>
                  {Math.round(sugarPct)}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${sugarOver ? 'bg-error-500' : 'bg-accent-500'}`}
                  style={{ width: `${sugarPct}%` }}
                />
              </div>
            </div>
          </div>

          {/* Sugar warning */}
          {sugarOver ? (
            <div className="animate-slide-up rounded-2xl border border-error-200 bg-error-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-100">
                  <AlertTriangle className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-error-800">糖分超標警告</h4>
                  <p className="mt-1 text-xs leading-relaxed text-error-700">
                    此杯飲品含糖 {totalSugar}g，已超過每日建議上限 {SUGAR_DAILY_LIMIT}g。
                    長期攝取過多糖分會增加脂肪堆積與代謝症候群風險，建議選擇微糖或無糖。
                  </p>
                </div>
              </div>
            </div>
          ) : totalSugar <= 8 ? (
            <div className="animate-slide-up rounded-2xl border border-success-200 bg-success-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-100">
                  <CheckCircle2 className="h-5 w-5 text-success-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-success-800">控糖達標！</h4>
                  <p className="mt-1 text-xs leading-relaxed text-success-700">
                    糖分 {totalSugar}g 在健康範圍內，是好選擇！
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          {/* Exercise conversion */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-slate-900">
              <Dumbbell className="h-5 w-5 text-primary-600" />
              運動換算
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              消耗這杯 {totalCalories} kcal 需要的運動時間（以 65kg 成人估算）
            </p>

            <div className="grid gap-2.5">
              {exerciseMinutes.map((ex) => (
                <div
                  key={ex.key}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
                      {ex.key === 'jogging' ? (
                        <Footprints className="h-4 w-4 text-primary-600" />
                      ) : ex.key === 'gym' ? (
                        <Dumbbell className="h-4 w-4 text-primary-600" />
                      ) : (
                        <Heart className="h-4 w-4 text-primary-600" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{ex.label}</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {ex.minutes}
                    <span className="ml-1 text-xs font-medium text-slate-400">分鐘</span>
                  </span>
                </div>
              ))}
            </div>

            {totalCalories > 0 && (
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-secondary-50 p-3 text-xs text-secondary-700">
                <Info className="h-4 w-4 shrink-0 text-secondary-500" />
                <span>
                  相當於需要 <b>{topExercise.minutes} 分鐘{topExercise.label}</b>才能完全消耗這杯飲料的熱量。
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
