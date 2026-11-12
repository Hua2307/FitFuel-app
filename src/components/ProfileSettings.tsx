import {
  Activity,
  AlertCircle,
  Calculator,
  Heart,
  Ruler,
  Save,
  Target,
  User,
  Weight,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  ACTIVITY_LABELS,
  bmiCategory,
  calculateBMI,
  calculateTDEE,
  DISEASE_OPTIONS,
  GENDER_LABELS,
  GOAL_LABELS,
} from '@/lib/drinkData';
import type { ActivityLevel, FitnessGoal, Gender, ProfileUpdate, UserProfile } from '@/lib/supabase';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSave: (update: ProfileUpdate) => void;
}

export default function ProfileSettings({ profile, onSave }: ProfileSettingsProps) {
  const [form, setForm] = useState({
    nickname: profile.nickname,
    gender: profile.gender,
    age: profile.age?.toString() ?? '',
    height_cm: profile.height_cm?.toString() ?? '',
    weight_kg: profile.weight_kg?.toString() ?? '',
    activity_level: profile.activity_level,
    goal: profile.goal,
    diseases: profile.diseases,
  });
  const [saved, setSaved] = useState(false);

  const bmi = useMemo(
    () => calculateBMI(form.height_cm ? parseFloat(form.height_cm) : null, form.weight_kg ? parseFloat(form.weight_kg) : null),
    [form.height_cm, form.weight_kg],
  );
  const bmiCat = bmi ? bmiCategory(bmi) : null;

  const previewProfile: UserProfile = {
    ...profile,
    gender: form.gender,
    age: form.age ? parseInt(form.age) : null,
    height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
    weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
    activity_level: form.activity_level,
    goal: form.goal,
  };
  const tdee = useMemo(() => calculateTDEE(previewProfile), [previewProfile]);

  const toggleDisease = (id: string) => {
    if (id === 'none') {
      setForm((p) => ({ ...p, diseases: ['none'] }));
      return;
    }
    setForm((p) => {
      const without = p.diseases.filter((d) => d !== 'none');
      return {
        ...p,
        diseases: without.includes(id) ? without.filter((d) => d !== id) : [...without, id],
      };
    });
  };

  const handleSave = () => {
    onSave({
      nickname: form.nickname.trim() || 'FitFuel 使用者',
      gender: form.gender,
      age: form.age ? parseInt(form.age) : null,
      height_cm: form.height_cm ? parseFloat(form.height_cm) : null,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      activity_level: form.activity_level,
      goal: form.goal,
      diseases: form.diseases.length === 0 ? ['none'] : form.diseases,
      daily_calorie_goal: tdee,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const hasDisease = !form.diseases.includes('none');

  return (
    <section className="space-y-6">
      <div className="mb-2">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-slate-900 sm:text-2xl">
          <User className="h-6 w-6 text-primary-600" />
          個人設定
        </h2>
        <p className="mt-1 text-sm text-slate-500">輸入您的身體數據與健康狀況，系統將自動計算每日熱量目標</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Form */}
        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
          <div className="space-y-4">
            {/* Nickname + Gender */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="暱稱" icon={User}>
                <input
                  type="text"
                  value={form.nickname}
                  onChange={(e) => setForm((p) => ({ ...p, nickname: e.target.value }))}
                  placeholder="您的名字"
                  className="input"
                />
              </Field>
              <Field label="性別" icon={Heart}>
                <div className="flex gap-2">
                  {(Object.keys(GENDER_LABELS) as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setForm((p) => ({ ...p, gender: g }))}
                      className={`flex-1 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                        form.gender === g
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {GENDER_LABELS[g]}
                    </button>
                  ))}
                </div>
              </Field>
            </div>

            {/* Age + Height + Weight */}
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="年齡" icon={Calculator}>
                <input
                  type="number"
                  value={form.age}
                  onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
                  placeholder="25"
                  className="input"
                />
              </Field>
              <Field label="身高 (cm)" icon={Ruler}>
                <input
                  type="number"
                  value={form.height_cm}
                  onChange={(e) => setForm((p) => ({ ...p, height_cm: e.target.value }))}
                  placeholder="170"
                  className="input"
                />
              </Field>
              <Field label="體重 (kg)" icon={Weight}>
                <input
                  type="number"
                  value={form.weight_kg}
                  onChange={(e) => setForm((p) => ({ ...p, weight_kg: e.target.value }))}
                  placeholder="65"
                  className="input"
                />
              </Field>
            </div>

            {/* Activity level */}
            <Field label="活動量" icon={Activity}>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
                {(Object.keys(ACTIVITY_LABELS) as ActivityLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setForm((p) => ({ ...p, activity_level: level }))}
                    className={`rounded-xl border-2 px-2 py-2.5 text-xs font-semibold transition-all ${
                      form.activity_level === level
                        ? 'border-secondary-500 bg-secondary-50 text-secondary-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {ACTIVITY_LABELS[level]}
                  </button>
                ))}
              </div>
            </Field>

            {/* Goal */}
            <Field label="目標" icon={Target}>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(GOAL_LABELS) as FitnessGoal[]).map((g) => (
                  <button
                    key={g}
                    onClick={() => setForm((p) => ({ ...p, goal: g }))}
                    className={`rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-all ${
                      form.goal === g
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-slate-200 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {GOAL_LABELS[g]}
                  </button>
                ))}
              </div>
            </Field>

            {/* Diseases */}
            <Field label="疾病狀況（可複選）" icon={AlertCircle}>
              <div className="flex flex-wrap gap-2">
                {DISEASE_OPTIONS.map((d) => {
                  const active = d.id === 'none' ? form.diseases.includes('none') : form.diseases.includes(d.id);
                  return (
                    <button
                      key={d.id}
                      onClick={() => toggleDisease(d.id)}
                      className={`rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all ${
                        active
                          ? d.id === 'none'
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-error-400 bg-error-50 text-error-700'
                          : 'border-slate-200 text-slate-500 hover:border-slate-300'
                      }`}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            <button
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-xl gradient-primary py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
            >
              <Save className="h-4 w-4" />
              {saved ? '已儲存！' : '儲存設定'}
            </button>
          </div>
        </div>

        {/* BMI + TDEE summary */}
        <div className="flex flex-col gap-4">
          {/* BMI card */}
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
            <h3 className="mb-4 text-lg font-bold text-slate-900">BMI 身體質量指數</h3>
            {bmi && bmiCat ? (
              <>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-extrabold text-slate-900">{bmi}</span>
                  <span className={`mb-1 text-sm font-bold ${bmiCat.color}`}>{bmiCat.label}</span>
                </div>
                <div className="mt-4 relative h-2.5 rounded-full bg-gradient-to-r from-secondary-300 via-success-400 via-accent-400 to-error-500">
                  <div
                    className="absolute -top-1 h-4.5 w-1 rounded-full bg-slate-800 shadow"
                    style={{ left: `${Math.min(100, Math.max(0, ((bmi - 15) / 20) * 100))}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-[10px] font-medium text-slate-400">
                  <span>過輕</span>
                  <span>健康</span>
                  <span>過重</span>
                  <span>肥胖</span>
                </div>
              </>
            ) : (
              <p className="py-6 text-center text-sm text-slate-400">請輸入身高與體重以計算 BMI</p>
            )}
          </div>

          {/* TDEE card */}
          <div className="relative overflow-hidden rounded-2xl gradient-hero p-5 text-white shadow-lg sm:p-6">
            <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="relative">
              <h3 className="mb-1 flex items-center gap-2 text-sm font-bold text-white/80">
                <Calculator className="h-4 w-4" />
                每日熱量目標 (TDEE)
              </h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-extrabold">{tdee.toLocaleString()}</span>
                <span className="mb-1 text-sm font-medium text-white/80">kcal</span>
              </div>
              <p className="mt-2 text-xs text-white/70">
                依據 BMR × 活動量 × 目標調整係數自動計算
              </p>
            </div>
          </div>

          {/* Disease warning */}
          {hasDisease && (
            <div className="animate-slide-up rounded-2xl border border-error-200 bg-error-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-100">
                  <AlertCircle className="h-5 w-5 text-error-600" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-error-800">健康提醒</h4>
                  <p className="mt-1 text-xs leading-relaxed text-error-700">
                    您已標記健康狀況，建議在飲食選擇上特別注意糖分、鈉與脂肪攝取，必要時請諮詢專業醫師或營養師。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: typeof User;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}
