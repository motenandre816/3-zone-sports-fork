import { NextResponse } from "next/server";
import type { UserProfilePayload } from "@/api/contracts";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { validateProfileInput } from "@/lib/validators";

type UserMutationGateway = {
  upsert: (
    payload: Record<string, unknown>,
    options: { onConflict: string },
  ) => {
    select: () => {
      single: () => Promise<{
        data: Record<string, unknown> | null;
        error: { code?: string; message: string } | null;
      }>;
    };
  };
};

type UserRouteDependencies = {
  createSupabaseServerClient: () => Promise<{
    from: (table: string) => unknown;
  }>;
  getCurrentUser: () => Promise<{ email?: string; id: string } | null>;
  isSupabaseConfigured: () => boolean;
};

const userRouteDependencies: UserRouteDependencies = {
  createSupabaseServerClient,
  getCurrentUser,
  isSupabaseConfigured,
};

export async function GET() {
  const user = await userRouteDependencies.getCurrentUser();

  return NextResponse.json({
    configured: userRouteDependencies.isSupabaseConfigured(),
    user: user
      ? {
          email: user.email,
          id: user.id,
        }
      : null,
  });
}

export async function handleUpsertUser(
  request: Request,
  dependencies: UserRouteDependencies = userRouteDependencies,
) {
  let payload: UserProfilePayload;

  try {
    payload = validateProfileInput(await request.json());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid profile payload." }, { status: 400 });
  }

  if (!dependencies.isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Configure Supabase environment variables before creating user profiles." },
      { status: 503 },
    );
  }

  const user = await dependencies.getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "You must be signed in to create a profile." }, { status: 401 });
  }

  const supabase = await dependencies.createSupabaseServerClient();
  const profiles = supabase.from("profiles") as UserMutationGateway;
  const { data, error } = await profiles
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

export async function POST(request: Request) {
  return handleUpsertUser(request);
}
