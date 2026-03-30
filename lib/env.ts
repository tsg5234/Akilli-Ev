import "server-only";

function getEnv(name: string) {
  return process.env[name]?.trim() ?? "";
}

export const env = {
  supabaseUrl: getEnv("SUPABASE_URL"),
  supabaseServiceRoleKey: getEnv("SUPABASE_SERVICE_ROLE_KEY"),
  sessionSecret: getEnv("SESSION_SECRET") || "gelistirme-icin-gecici-gizli-anahtar"
};

export function isSupabaseConfigured() {
  return (
    Boolean(env.supabaseUrl) &&
    Boolean(env.supabaseServiceRoleKey) &&
    env.supabaseUrl !== "https://proje-kimliginiz.supabase.co" &&
    env.supabaseServiceRoleKey !== "service-role-key"
  );
}

export function assertSupabaseEnv() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error("SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY tanımlanmalı.");
  }
}
