export type ArticlePayload = {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  slug: string;
  readTime?: string;
};

export type UserProfilePayload = {
  fullName: string;
  favoriteTeam?: string;
  bio?: string;
};

export type AuthSessionResponse = {
  configured: boolean;
  user: {
    id: string;
    email: string | undefined;
  } | null;
};
