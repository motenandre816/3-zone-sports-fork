import { NextResponse } from "next/server";
import type { AuthSessionResponse } from "@/api/contracts";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      configured: false,
      user: null,
    });
  }

  const user = await getCurrentUser();
  const response: AuthSessionResponse = {
    configured: true,
    user: user
      ? {
          email: user.email,
          id: user.id,
        }
      : null,
  };

  return NextResponse.json(response);
}
