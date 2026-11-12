import {
  AlertTriangle,
  Apple,
  Beef,
  ChevronDown,
  Droplets,
  Flame,
  Plus,
  Snowflake,
  TrendingDown,
  TrendingUp,
  Wheat,
  Zap,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Label,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import {
  calculateMacroGoals,
  SUGAR_DAILY_LIMIT,
  WATER_GOAL_ML,
} from '@/lib/drinkData';
import type { ExerciseRecord, MealRecord, UserProfile, WaterRecord } from '@/lib/supabase';

export interface DrinkSummary {
  emoji: string;
  name: string;
  totalCalories: number;
  totalSugar: number;
  sugarOver: boolean;
}

interface DashboardProps {
  meals: MealRecord[];
  exercises: ExerciseRecord[];
  water: WaterRecord | null;
  profile: UserProfile | null;
  drinkSummary: DrinkSummary | null;
  onAddWater: (ml: number) => void;
  onSetWaterGoal: (goal: number) => void;
}

const QUICK_WATER = [200, 350, 500];

const COLORS = {
  protein: '#0db766',
  carbs: '#31a3ff',
  fat: '#f59e0b',
  deficit: '#aef2cf',
  surplus: '#fca5a5',
  water: '#31a3ff',
  waterTrack: '#bce7ff',
};

export default function Dashboard({
  meals,
  exercises,
  water,
  profile,
  drinkSummary,
  onAddWater,
  onSetWaterGoal,
}: DashboardProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const calorieGoal = profile?.daily_calorie_goal ?? 2000;
  const macroGoals = useMemo(() => calculateMacroGoals(calorieGoal), [calorieGoal]);

  const todaysMeals = useMemo(
    () => meals.filter((m) => m.recorded_at === todayStr),
    [meals, todayStr],
  );
  const todaysExercises = useMemo(
    () => exercises.filter((e) => e.recorded_at === todayStr),
    [exercises, todayStr],
  );

  const intakeCalories = todaysMeals.reduce((sum, m) => sum + m.calories, 0);
  const burnedCalories = todaysExercises.reduce((sum, e) => sum + e.calories_burned, 0);
  const netCalories = intakeCalories - burnedCalories;
  const balance = calorieGoal - netCalories;
  const isDeficit = balance > 0;

  const totals = useMemo(() => {
    return todaysMeals.reduce(
      (acc, m) => ({
        protein: acc.protein + Number(m.protein),
        carbs: acc.carbs + Number(m.carbs),
        fat: acc.fat + Number(m.fat),
      }),
      { protein: 0, carbs: 0, fat: 0 },
    );
  }, [todaysMeals]);

  const waterAmount = water?.amount_ml ?? 0;
  const waterGoal = water?.goal_ml ?? profile?.water_goal_ml ?? WATER_GOAL_ML;
  const waterPct = Math.min(100, (waterAmount / waterGoal) * 100);

  const [goalMenuOpen, setGoalMenuOpen] = useState(false);
  const [manualWater, setManualWater] = useState('');

  const ringPct = Math.min(100, Math.round((Math.abs(netCalories) / calorieGoal) * 100));

  const calorieRingData = [{ name: 'heat', value: ringPct, fill: isDeficit ? COLORS.deficit : COLORS.surplus }];

  const macroBarData = [
    {
      name: '蛋白質',
      key: 'protein',
      value: Math.round(totals.protein),
      goal: macroGoals.protein,
      fill: COLORS.protein,
      icon: Beef,
    },
    {
      name: '碳水化合物',
      key: 'carbs',
      value: Math.round(totals.carbs),
      goal: macroGoals.carbs,
      fill: COLORS.carbs,
      icon: Wheat,
    },
    {
      name: '脂肪',
      key: 'fat',
      value: Math.round(totals.fat),
      goal: macroGoals.fat,
      fill: COLORS.fat,
      icon: Apple,
    },
  ];

  const waterRingData = [{ name: 'water', value: Math.round(waterPct), fill: COLORS.water }];

  const handleManualWater = () => {
    const ml = parseInt(manualWater);
    if (ml > 0) {
      onAddWater(ml);
      setManualWater('');
    }
  };

  return (
    <section id="dashboard" className="scroll-mt-20">
      {/* Hero calorie balance card */}
      <div className="relative overflow-hidden rounded-3xl gradient-hero p-6 text-white shadow-2xl shadow-primary/20 sm:p-8">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

        <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white/80">
              <Zap className="h-4 w-4" />
              每日熱量對衝
            </div>
            <h2 className="mb-4 text-2xl font-extrabold tracking-tight sm:text-3xl">
              {new Date().toLocaleDateString('zh-TW', { month: 'long', day: 'numeric', weekday: 'long' })}
            </h2>

            <div className="flex flex-wrap items-end gap-2">
              <span className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                {Math.abs(balance).toLocaleString()}
              </span>
              <span className="mb-2 text-lg font-bold text-white/90">kcal</span>
            </div>

            <div
              className={`mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold backdrop-blur-sm ${
                isDeficit
                  ? 'bg-white/20 text-white'
                  : 'bg-error-500/90 text-white'
              }`}
            >
              {isDeficit ? (
                <>
                  <TrendingDown className="h-4 w-4" />
                  熱量赤字 · 適合減脂
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4" />
                  熱量盈餘 · 注意攝取
                </>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
              <StatBlock label="目標熱量" value={calorieGoal} icon={Flame} />
              <StatBlock label="飲食攝取" value={intakeCalories} icon={Apple} />
              <StatBlock label="運動消耗" value={burnedCalories} icon={Zap} />
            </div>
          </div>

          {/* Calorie ring */}
          <div className="flex justify-center">
            <div className="relative h-52 w-52 sm:h-56 sm:w-56">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={calorieRingData}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="78%"
                  outerRadius="100%"
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: 'rgba(255,255,255,0.15)' }}
                    dataKey="value"
                    cornerRadius={20}
                    angleAxisId={0}
                  >
                    {calorieRingData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.fill} />
                    ))}
                    <Label
                      position="center"
                      content={({ viewBox }) => {
                        if (!viewBox || !('cx' in viewBox)) return null;
                        const { cx, cy } = viewBox as { cx: number; cy: number };
                        return (
                          <g>
                            <text x={cx} y={cy - 4} textAnchor="middle" className="fill-white" fontSize="30" fontWeight="800">
                              {ringPct}%
                            </text>
                            <text x={cx} y={cy + 16} textAnchor="middle" className="fill-white/70" fontSize="11" fontWeight="500">
                              每日熱量使用
                            </text>
                          </g>
                        );
                      }}
                    />
                  </RadialBar>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Macros + Water + Drink summary row */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Macros */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
          <h3 className="mb-1 text-lg font-bold text-slate-900">三大營養素攝取</h3>
          <p className="mb-5 text-sm text-slate-500">今日累計攝取量與目標比例</p>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={macroBarData}
                layout="vertical"
                margin={{ top: 4, right: 20, left: 0, bottom: 4 }}
                barCategoryGap={24}
              >
                <XAxis type="number" hide domain={[0, (dataMax: number) => Math.max(dataMax * 1.2, 100)]} />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  width={90}
                  tick={{ fontSize: 13, fill: '#334155', fontWeight: 600 }}
                />
                <ReferenceLine x={macroGoals.protein} yAxisId={0} stroke={COLORS.protein} strokeDasharray="4 4" />
                <ReferenceLine x={macroGoals.carbs} yAxisId={0} stroke={COLORS.carbs} strokeDasharray="4 4" />
                <ReferenceLine x={macroGoals.fat} yAxisId={0} stroke={COLORS.fat} strokeDasharray="4 4" />
                <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={24}>
                  {macroBarData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {macroBarData.map((macro) => {
              const over = macro.value > macro.goal;
              const pct = Math.min(100, (macro.value / macro.goal) * 100);
              const Icon = macro.icon;
              return (
                <div key={macro.key} className="rounded-xl bg-slate-50 p-3">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Icon className="h-3.5 w-3.5" style={{ color: macro.fill }} />
                    <span className="text-xs font-semibold text-slate-600">{macro.name}</span>
                  </div>
                  <div className="text-lg font-extrabold text-slate-800">
                    {macro.value}
                    <span className="text-xs font-medium text-slate-400"> / {macro.goal}g</span>
                  </div>
                  <div className="mt-1 text-[11px] font-bold" style={{ color: over ? '#dc2626' : macro.fill }}>
                    {Math.round(pct)}%{over && ' · 超標'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Water tracker with manual input */}
        <div className="relative overflow-hidden rounded-2xl border border-secondary-200/70 bg-gradient-to-br from-secondary-50 to-white p-5 shadow-sm sm:p-6">
          <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-secondary-100/60 blur-2xl" />
          <div className="relative">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary-100">
                  <Droplets className="h-4 w-4 text-secondary-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">飲水量追蹤</h3>
              </div>

              <div className="relative">
                <button
                  onClick={() => setGoalMenuOpen(!goalMenuOpen)}
                  className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-slate-500 hover:bg-slate-100"
                >
                  目標 {waterGoal}ml
                  <ChevronDown className="h-3 w-3" />
                </button>
                {goalMenuOpen && (
                  <div className="absolute right-0 top-8 z-10 animate-fade-in rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                    {[2000, 2500, 3000, 3500].map((g) => (
                      <button
                        key={g}
                        onClick={() => {
                          onSetWaterGoal(g);
                          setGoalMenuOpen(false);
                        }}
                        className={`block w-full rounded-lg px-3 py-1.5 text-left text-xs font-semibold transition-colors hover:bg-secondary-50 ${
                          waterGoal === g ? 'text-secondary-700' : 'text-slate-600'
                        }`}
                      >
                        {g}ml
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Water radial gauge */}
            <div className="relative mx-auto mt-3 h-36 w-36">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  data={waterRingData}
                  startAngle={90}
                  endAngle={-270}
                  innerRadius="72%"
                  outerRadius="100%"
                >
                  <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                  <RadialBar
                    background={{ fill: COLORS.waterTrack }}
                    dataKey="value"
                    cornerRadius={16}
                    angleAxisId={0}
                  >
                    <Label
                      position="center"
                      content={({ viewBox }) => {
                        if (!viewBox || !('cx' in viewBox)) return null;
                        const { cx, cy } = viewBox as { cx: number; cy: number };
                        return (
                          <g>
                            <text x={cx} y={cy - 6} textAnchor="middle" className="fill-secondary-700" fontSize="22" fontWeight="800">
                              {waterAmount.toLocaleString()}
                            </text>
                            <text x={cx} y={cy + 12} textAnchor="middle" className="fill-slate-400" fontSize="10" fontWeight="500">
                              / {waterGoal}ml · {Math.round(waterPct)}%
                            </text>
                          </g>
                        );
                      }}
                    />
                  </RadialBar>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 text-center text-xs font-medium text-slate-500">
              {waterPct >= 100 ? '今日目標已達成！' : `還差 ${(waterGoal - waterAmount).toLocaleString()}ml`}
            </div>

            {/* Quick buttons */}
            <div className="mt-4 flex gap-2">
              {QUICK_WATER.map((ml) => (
                <button
                  key={ml}
                  onClick={() => onAddWater(ml)}
                  className="flex flex-1 flex-col items-center gap-1 rounded-xl border border-secondary-200 bg-white py-2.5 text-xs font-bold text-secondary-700 transition-all hover:border-secondary-400 hover:bg-secondary-50 active:scale-95"
                >
                  <Droplets className="h-4 w-4" />
                  +{ml}ml
                </button>
              ))}
            </div>

            {/* Manual water input */}
            <div className="mt-2 flex gap-2">
              <input
                type="number"
                value={manualWater}
                onChange={(e) => setManualWater(e.target.value)}
                placeholder="自行輸入 ml"
                className="input flex-1 py-2 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleManualWater()}
              />
              <button
                onClick={handleManualWater}
                disabled={!manualWater || parseInt(manualWater) <= 0}
                className="flex items-center gap-1 rounded-xl bg-secondary-600 px-3 py-2 text-xs font-bold text-white transition-all hover:bg-secondary-700 active:scale-95 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                增加
              </button>
            </div>

            {waterAmount > 0 && (
              <button
                onClick={() => onAddWater(-200)}
                className="mt-2 w-full rounded-lg py-1.5 text-xs font-semibold text-slate-400 transition-colors hover:text-error-500"
              >
                <Snowflake className="mr-1 inline h-3 w-3" />退回 200ml
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Drink sugar & calorie summary — integrated into dashboard */}
      {drinkSummary && drinkSummary.totalCalories > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <span className="text-xl">{drinkSummary.emoji}</span>
                {drinkSummary.name} · 熱量糖分摘要
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">總熱量</div>
                <div className="mt-1 text-3xl font-extrabold text-slate-900">{drinkSummary.totalCalories}</div>
                <div className="text-xs font-medium text-slate-400">kcal</div>
              </div>
              <div className="rounded-xl bg-slate-50 p-4">
                <div className="text-xs font-medium text-slate-500">糖分</div>
                <div className={`mt-1 text-3xl font-extrabold ${drinkSummary.sugarOver ? 'text-error-600' : 'text-slate-900'}`}>
                  {drinkSummary.totalSugar}g
                </div>
                <div className="text-xs font-medium text-slate-400">每日上限 {SUGAR_DAILY_LIMIT}g</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-500">糖分佔每日上限比例</span>
                <span className={`font-bold ${drinkSummary.sugarOver ? 'text-error-600' : 'text-slate-600'}`}>
                  {Math.min(100, Math.round((drinkSummary.totalSugar / SUGAR_DAILY_LIMIT) * 100))}%
                </span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${drinkSummary.sugarOver ? 'bg-error-500' : 'bg-accent-500'}`}
                  style={{ width: `${Math.min(100, (drinkSummary.totalSugar / SUGAR_DAILY_LIMIT) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {drinkSummary.sugarOver && (
            <div className="flex items-start gap-3 rounded-2xl border border-error-200 bg-error-50 p-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-100">
                <AlertTriangle className="h-5 w-5 text-error-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-error-800">糖分超標警告</h4>
                <p className="mt-1 text-xs leading-relaxed text-error-700">
                  此杯飲品含糖 {drinkSummary.totalSugar}g，已超過每日建議上限 {SUGAR_DAILY_LIMIT}g。
                  長期攝取過多糖分會增加脂肪堆積與代謝症候群風險，建議選擇微糖或無糖。
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty state banner */}
      {todaysMeals.length === 0 && todaysExercises.length === 0 && (
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-accent-600" />
          <span className="font-medium text-accent-800">
            今日尚未有任何紀錄，切換到飲食或運動頁面新增您的第一筆紀錄吧！
          </span>
        </div>
      )}
    </section>
  );
}

function StatBlock({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Flame;
}) {
  return (
    <div className="rounded-xl bg-white/15 p-3 backdrop-blur-sm sm:p-4">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-white/70">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-xl font-extrabold sm:text-2xl">{value.toLocaleString()}</div>
      <div className="text-[10px] font-medium text-white/60">kcal</div>
    </div>
  );
}
