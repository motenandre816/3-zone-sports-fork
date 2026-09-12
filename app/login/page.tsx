type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectTo = params.redirectTo || "/profile";

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Login</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Welcome back to 3 Zone Sports</h1>
        <p className="mt-3 text-sm text-slate-600">
          Sign in with Supabase Auth to manage your newsroom profile and protected content tools.
        </p>
      </div>

      {params.message ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {params.message}
        </p>
      ) : null}
      {params.error ? (
        <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {params.error}
        </p>
      ) : null}

      <form action="/api/auth/login" method="post" className="space-y-4 rounded-3xl bg-white p-8 shadow-sm">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <label className="block text-sm font-medium text-slate-700">
          Email
          <input
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-orange-500 focus:ring"
            name="email"
            type="email"
            placeholder="editor@3zonesports.com"
            required
          />
        </label>
        <label className="block text-sm font-medium text-slate-700">
          Password
          <input
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-orange-500 focus:ring"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />
        </label>
        <button
          className="w-full rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          type="submit"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
