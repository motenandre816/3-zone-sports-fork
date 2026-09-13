import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
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
        `/login?error=${encodeURIComponent(error instanceof Error ? error.message : "Unable to sign in.")}`,
      ),
    );
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(
      toRedirectUrl(request, "/login?error=Add%20Supabase%20environment%20variables%20before%20signing%20in."),
    );
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    return NextResponse.redirect(
      toRedirectUrl(
        request,
        `/login?error=${encodeURIComponent(error.message)}&redirectTo=${encodeURIComponent(credentials.redirectTo)}`,
      ),
    );
  }

  return NextResponse.redirect(toRedirectUrl(request, credentials.redirectTo));
}
