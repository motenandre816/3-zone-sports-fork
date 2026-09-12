export type Article = {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: string;
  slug: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  favorite_team: string | null;
  bio: string | null;
};
