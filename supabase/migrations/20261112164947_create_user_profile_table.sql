/*
# FitFuel - User profile table (single-tenant, no auth)

1. New Tables
- `user_profile`: Stores a single user's body data and health conditions.
  - `id` (uuid, primary key)
  - `nickname` (text, display name)
  - `gender` (text: male/female/other)
  - `age` (integer)
  - `height_cm` (numeric, height in centimeters)
  - `weight_kg` (numeric, weight in kilograms)
  - `activity_level` (text: sedentary/light/moderate/active/very_active)
  - `goal` (text: lose_fat/build_muscle/maintain)
  - `diseases` (text array, e.g. diabetes, hypertension, hyperlipidemia, none)
  - `daily_calorie_goal` (integer, auto-calculated or manual override)
  - `water_goal_ml` (integer, default 2500)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `user_profile`.
- Grant CRUD to `anon` + `authenticated` (no-auth single-tenant app).
*/

CREATE TABLE IF NOT EXISTS user_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nickname text NOT NULL DEFAULT 'FitFuel 使用者',
  gender text NOT NULL DEFAULT 'other' CHECK (gender IN ('male','female','other')),
  age integer,
  height_cm numeric(5,1),
  weight_kg numeric(5,1),
  activity_level text NOT NULL DEFAULT 'moderate' CHECK (activity_level IN ('sedentary','light','moderate','active','very_active')),
  goal text NOT NULL DEFAULT 'maintain' CHECK (goal IN ('lose_fat','build_muscle','maintain')),
  diseases text[] NOT NULL DEFAULT ARRAY['none']::text[],
  daily_calorie_goal integer NOT NULL DEFAULT 2000,
  water_goal_ml integer NOT NULL DEFAULT 2500,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON user_profile TO anon, authenticated;

DROP POLICY IF EXISTS "anon_select_user_profile" ON user_profile;
CREATE POLICY "anon_select_user_profile" ON user_profile FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_user_profile" ON user_profile;
CREATE POLICY "anon_insert_user_profile" ON user_profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_user_profile" ON user_profile;
CREATE POLICY "anon_update_user_profile" ON user_profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_user_profile" ON user_profile;
CREATE POLICY "anon_delete_user_profile" ON user_profile FOR DELETE
  TO anon, authenticated USING (true);
