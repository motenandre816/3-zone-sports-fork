import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/profile");
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Profile</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          {user.user_metadata.full_name || "3 Zone Sports Member"}
        </h1>
        <p className="mt-3 text-sm text-slate-600">{user.email}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Account status</h2>
            <p className="mt-2 text-sm text-slate-600">{user.email_confirmed_at ? "Verified" : "Pending verification"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Auth provider</h2>
            <p className="mt-2 text-sm text-slate-600">{user.app_metadata.provider || "email"}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h2 className="text-sm font-semibold text-slate-900">Supabase</h2>
            <p className="mt-2 text-sm text-slate-600">{isSupabaseConfigured ? "Connected" : "Add env vars to connect"}</p>
          </div>
        </div>

        <form action="/api/auth/logout" method="post" className="mt-8">
          <button
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
            type="submit"
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
