import {
  Bike,
  Dumbbell,
  Footprints,
  Heart,
  MinusCircle,
  Plus,
  Waves,
  Zap,
} from 'lucide-react';
import { useState } from 'react';
import type {
  ExerciseRecord,
  NewExerciseInput,
} from '@/lib/supabase';

interface ExerciseTrackerProps {
  exercises: ExerciseRecord[];
  onAddExercise: (input: NewExerciseInput) => void;
  onDeleteExercise: (id: string) => void;
}

const EXERCISE_PRESETS: { label: string; name: string; kcal: number; min: number; icon: typeof Dumbbell }[] = [
  { label: '慢跑 30分', name: '慢跑', kcal: 250, min: 30, icon: Footprints },
  { label: '重訓 45分', name: '健身重訓', kcal: 270, min: 45, icon: Dumbbell },
  { label: '騎車 40分', name: '騎自行車', kcal: 300, min: 40, icon: Bike },
  { label: '游泳 30分', name: '游泳', kcal: 294, min: 30, icon: Waves },
  { label: '快走 60分', name: '快走', kcal: 258, min: 60, icon: Heart },
  { label: '跳繩 15分', name: '跳繩', kcal: 165, min: 15, icon: Zap },
];

const todayStr = () => new Date().toISOString().split('T')[0];

export default function ExerciseTracker({ exercises, onAddExercise, onDeleteExercise }: ExerciseTrackerProps) {
  const [exName, setExName] = useState('');
  const [exCalories, setExCalories] = useState('');
  const [exDuration, setExDuration] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const todaysExercises = exercises.filter((e) => e.recorded_at === todayStr());
  const totalBurned = todaysExercises.reduce((s, e) => s + e.calories_burned, 0);

  const handleSubmit = () => {
    if (!exName.trim() || !exCalories) return;
    setSubmitting(true);
    onAddExercise({
      name: exName.trim(),
      calories_burned: parseInt(exCalories) || 0,
      duration_min: parseInt(exDuration) || 0,
    });
    setExName('');
    setExCalories('');
    setExDuration('');
    setSubmitting(false);
  };

  return (
    <section className="space-y-6">
      <div className="mb-2">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
          <Dumbbell className="h-6 w-6 text-secondary-600" />
          運動紀錄
        </h2>
        <p className="mt-1 text-sm text-slate-500">新增今日運動項目，消耗熱量自動同步至儀表板</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-slate-900">新增運動</h3>

          <div className="space-y-3">
            <Field label="運動項目">
              <input
                type="text"
                value={exName}
                onChange={(e) => setExName(e.target.value)}
                placeholder="例如：慢跑"
                className="input"
              />
            </Field>

            <div className="grid grid-cols-2 gap-2">
              <Field label="消耗熱量 (kcal)">
                <input
                  type="number"
                  value={exCalories}
                  onChange={(e) => setExCalories(e.target.value)}
                  placeholder="250"
                  className="input"
                />
              </Field>
              <Field label="時長 (分鐘)">
                <input
                  type="number"
                  value={exDuration}
                  onChange={(e) => setExDuration(e.target.value)}
                  placeholder="30"
                  className="input"
                />
              </Field>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-slate-500">快速選填</label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {EXERCISE_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => {
                      setExName(p.name);
                      setExCalories(String(p.kcal));
                      setExDuration(String(p.min));
                    }}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-600 transition-all hover:border-secondary-400 hover:bg-secondary-50 hover:text-secondary-700"
                  >
                    <p.icon className="h-3.5 w-3.5 shrink-0" />
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !exName.trim() || !exCalories}
              className="w-full rounded-xl bg-gradient-to-r from-secondary-500 to-secondary-700 py-3 text-sm font-bold text-white shadow-lg shadow-secondary/20 transition-all hover:shadow-xl hover:shadow-secondary/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="mr-1 inline h-4 w-4" />新增運動紀錄
            </button>
          </div>
        </div>

        {/* Records list */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-900">今日運動紀錄</h3>
              <span className="rounded-full bg-secondary-50 px-3 py-0.5 text-xs font-bold text-secondary-700">
                {todaysExercises.length} 筆
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-medium text-slate-400">總消耗</span>
              <div className="text-lg font-extrabold text-secondary-700">{totalBurned} kcal</div>
            </div>
          </div>

          {todaysExercises.length === 0 ? (
            <EmptyState text="今日尚無運動紀錄" icon={Dumbbell} />
          ) : (
            <div className="space-y-2">
              {todaysExercises
                .sort((a, b) => b.created_at.localeCompare(a.created_at))
                .map((ex) => (
                  <div
                    key={ex.id}
                    className="group flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary-100">
                      <Zap className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-bold text-slate-800">{ex.name}</span>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-secondary-700">-{ex.calories_burned} kcal</span>
                        <span>{ex.duration_min} 分鐘</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteExercise(ex.id)}
                      className="shrink-0 text-slate-300 transition-colors hover:text-error-500"
                      aria-label="刪除"
                    >
                      <MinusCircle className="h-5 w-5" />
                    </button>
                  </div>
                ))}
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

function EmptyState({ text, icon: Icon }: { text: string; icon: typeof Dumbbell }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Icon className="h-6 w-6 text-slate-300" />
      </div>
      <p className="text-sm text-slate-400">{text}</p>
    </div>
  );
}
