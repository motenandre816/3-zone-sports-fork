export type Article = {
  id: string;
  authorSlug: string;
  category: string;
  excerpt: string;
  author: string;
  content: string;
  imageUrl: string;
  isFeatured: boolean;
  league: string;
  publishedAt: string;
  readTime: string;
  slug: string;
  status: "draft" | "published";
  tags: string[];
  team: string;
  title: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  favorite_team: string | null;
  bio: string | null;
};

export type Comment = {
  articleSlug: string;
  authorName: string;
  body: string;
  createdAt: string;
  id: string;
};

export type ArticleFilters = {
  category?: string;
  limit?: number;
  query?: string;
};

export type AuthorSummary = {
  articleCount: number;
  author: string;
  authorSlug: string;
  bio: string;
  favoriteTeam: string;
  latestArticleTitle: string;
};
