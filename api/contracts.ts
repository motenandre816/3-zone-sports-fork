export type ArticlePayload = {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  slug: string;
  authorSlug?: string;
  content: string;
  imageUrl?: string;
  isFeatured?: boolean;
  league: string;
  publishedAt?: string | null;
  readTime?: string;
  status?: "draft" | "published";
  tags?: string[];
  team?: string;
};

export type UserProfilePayload = {
  fullName: string;
  favoriteTeam?: string;
  bio?: string;
};

export type CommentPayload = {
  articleSlug: string;
  authorName: string;
  body: string;
};

export type NewsletterPayload = {
  email: string;
  name?: string;
};

export type AuthSessionResponse = {
  configured: boolean;
  user: {
    id: string;
    email: string | undefined;
  } | null;
};
