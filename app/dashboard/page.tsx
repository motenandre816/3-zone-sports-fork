import { redirect } from "next/navigation";
import { EditorDashboard } from "@/components/editor-dashboard";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardArticles } from "@/lib/content";

type DashboardPageProps = {
  searchParams: Promise<{
    edit?: string;
  }>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard");
  }

  const params = await searchParams;
  const articles = await getDashboardArticles();
  const selectedArticle = articles.find((article) => article.slug === params.edit) || null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10">
      <section className="rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-600">Editorial dashboard</p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">Manage stories, drafts, and publish controls</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Use this dashboard to create articles, update metadata, and control which stories appear on the public site.
        </p>
      </section>
      <EditorDashboard articles={articles} selectedArticle={selectedArticle} />
    </div>
  );
}
