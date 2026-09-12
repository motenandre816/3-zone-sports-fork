type SignUpPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
  }>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6 px-6 py-12">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Create account</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Start building your audience</h1>
        <p className="mt-3 text-sm text-slate-600">
          Connect free Supabase authentication to support readers, writers, and contributor profiles.
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

      <form action="/api/auth/signup" method="post" className="space-y-4 rounded-3xl bg-white p-8 shadow-sm">
        <label className="block text-sm font-medium text-slate-700">
          Full name
          <input
            className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-orange-500 focus:ring"
            name="fullName"
            type="text"
            placeholder="3 Zone Sports Editor"
          />
        </label>
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
            placeholder="Create a secure password"
            required
          />
        </label>
        <button
          className="w-full rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-400"
          type="submit"
        >
          Create account
        </button>
      </form>
    </div>
  );
}
