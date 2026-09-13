import { NextResponse } from "next/server";
import { env, isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateCredentials } from "@/lib/validators";

function toRedirectUrl(request: Request, path: string) {
  return new URL(path, request.url);
}

export async function POST(request: Request) {
  const formData = await request.formData();

  let credentials;
  try {
    credentials = validateCredentials(Object.fromEntries(formData.entries()));
  } catch (error) {
    return NextResponse.redirect(
      toRedirectUrl(
        request,
        `/signup?error=${encodeURIComponent(error instanceof Error ? error.message : "Unable to create account.")}`,
      ),
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      toRedirectUrl(request, "/signup?error=Add%20Supabase%20environment%20variables%20before%20creating%20accounts."),
    );
  }

  if (!credentials.fullName) {
    return NextResponse.redirect(
      toRedirectUrl(request, "/signup?error=Full%20name%20is%20required."),
    );
  }

  const supabase = await createSupabaseServerClient();
  const emailRedirectUrl = new URL("/auth/callback", env.siteUrl);
  emailRedirectUrl.searchParams.set("next", "/profile");

  const { error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.fullName,
      },
      emailRedirectTo: emailRedirectUrl.toString(),
    },
  });

  if (error) {
    return NextResponse.redirect(
      toRedirectUrl(request, `/signup?error=${encodeURIComponent(error.message)}`),
    );
  }

  return NextResponse.redirect(
    toRedirectUrl(request, "/login?message=Check%20your%20email%20to%20confirm%20your%20account."),
  );
}
