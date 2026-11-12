/*
# FitFuel - Health tracking tables (single-tenant, no auth)

1. New Tables
- `meal_records`: Records of food intake (breakfast, lunch, dinner, snack).
  - `id` (uuid, primary key)
  - `meal_type` (text: breakfast/lunch/dinner/snack)
  - `name` (text, name of the food)
  - `calories` (int, kcal)
  - `protein` (numeric, grams)
  - `carbs` (numeric, grams)
  - `fat` (numeric, grams)
  - `recorded_at` (date, the day the meal belongs to)
  - `created_at` (timestamptz)
- `exercise_records`: Records of exercise activity.
  - `id` (uuid, primary key)
  - `name` (text, name of the exercise)
  - `calories_burned` (int, kcal)
  - `duration_min` (int, minutes)
  - `recorded_at` (date, the day the exercise belongs to)
  - `created_at` (timestamptz)
- `water_records`: Daily water intake log (one row per day).
  - `id` (uuid, primary key)
  - `amount_ml` (int, milliliters consumed that day)
  - `goal_ml` (int, target milliliters, default 2500)
  - `recorded_at` (date, unique per day)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on all three tables.
- Grant CRUD to `anon` + `authenticated` (no-auth single-tenant app).
- Allow anon + authenticated full CRUD because data is intentionally shared/public.
*/

CREATE TABLE IF NOT EXISTS meal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner','snack')),
  name text NOT NULL,
  calories integer NOT NULL DEFAULT 0,
  protein numeric(6,1) NOT NULL DEFAULT 0,
  carbs numeric(6,1) NOT NULL DEFAULT 0,
  fat numeric(6,1) NOT NULL DEFAULT 0,
  recorded_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exercise_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calories_burned integer NOT NULL DEFAULT 0,
  duration_min integer NOT NULL DEFAULT 0,
  recorded_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS water_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_ml integer NOT NULL DEFAULT 0,
  goal_ml integer NOT NULL DEFAULT 2500,
  recorded_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (recorded_at)
);

ALTER TABLE meal_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercise_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE water_records ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON meal_records TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON exercise_records TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON water_records TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_meal_records" ON meal_records;
CREATE POLICY "anon_select_meal_records" ON meal_records FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_meal_records" ON meal_records;
CREATE POLICY "anon_insert_meal_records" ON meal_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_meal_records" ON meal_records;
CREATE POLICY "anon_update_meal_records" ON meal_records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_meal_records" ON meal_records;
CREATE POLICY "anon_delete_meal_records" ON meal_records FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_exercise_records" ON exercise_records;
CREATE POLICY "anon_select_exercise_records" ON exercise_records FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_exercise_records" ON exercise_records;
CREATE POLICY "anon_insert_exercise_records" ON exercise_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_exercise_records" ON exercise_records;
CREATE POLICY "anon_update_exercise_records" ON exercise_records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_exercise_records" ON exercise_records;
CREATE POLICY "anon_delete_exercise_records" ON exercise_records FOR DELETE
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_water_records" ON water_records;
CREATE POLICY "anon_select_water_records" ON water_records FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_water_records" ON water_records;
CREATE POLICY "anon_insert_water_records" ON water_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_water_records" ON water_records;
CREATE POLICY "anon_update_water_records" ON water_records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_water_records" ON water_records;
CREATE POLICY "anon_delete_water_records" ON water_records FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_meal_records_recorded_at ON meal_records (recorded_at);
CREATE INDEX IF NOT EXISTS idx_exercise_records_recorded_at ON exercise_records (recorded_at);
CREATE INDEX IF NOT EXISTS idx_water_records_recorded_at ON water_records (recorded_at);
