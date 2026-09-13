const env = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || "3 Zone Sports",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
};

function hasRealValue(value: string) {
  return Boolean(value.trim()) && !value.includes("your-");
}

export function isSupabaseConfigured() {
  return hasRealValue(env.supabaseUrl) && hasRealValue(env.supabaseAnonKey);
}

export function getSupabaseEnv() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase environment variables are missing. Populate NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return env;
}

export { env };
