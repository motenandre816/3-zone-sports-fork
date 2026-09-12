import { NextResponse } from "next/server";
import type { UserProfilePayload } from "@/api/contracts";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/validators";

export async function GET() {
  const user = await getCurrentUser();

  return NextResponse.json({
    configured: isSupabaseConfigured(),
    user: user
      ? {
          email: user.email,
          id: user.id,
        }
      : null,
  });
}

export async function POST(request: Request) {
  let payload: UserProfilePayload;

  try {
    payload = validateProfileInput(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid profile payload." }, { status: 400 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Configure Supabase environment variables before creating user profiles." },
      { status: 503 },
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to create a profile." }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        bio: payload.bio || null,
        favorite_team: payload.favoriteTeam || null,
        full_name: payload.fullName,
        id: user.id,
      },
      { onConflict: "id" },
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data }, { status: 201 });
}
