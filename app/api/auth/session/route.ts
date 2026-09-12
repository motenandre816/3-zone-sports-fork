import { NextResponse } from "next/server";
import type { AuthSessionResponse } from "@/api/contracts";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  const user = await getCurrentUser();
  const response: AuthSessionResponse = {
    configured: isSupabaseConfigured(),
    user: user
      ? {
          email: user.email,
          id: user.id,
        }
      : null,
  };

  return NextResponse.json(response);
}
