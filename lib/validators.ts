function sanitizeRedirectPath(value: string, fallback = "/profile") {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return fallback;
  }

  return value;
}

type ArticleInput = {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  slug: string;
  readTime?: string;
};

type ProfileInput = {
  fullName: string;
  favoriteTeam?: string;
  bio?: string;
};

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

export function validateArticleInput(value: unknown): ArticleInput {
  const record = asRecord(value);
  const article = {
    author: String(record.author || "").trim(),
    category: String(record.category || "").trim(),
    excerpt: String(record.excerpt || "").trim(),
    readTime: String(record.readTime || "5 min read").trim(),
    slug: String(record.slug || "").trim(),
    title: String(record.title || "").trim(),
  };

  if (
    !article.title ||
    !article.excerpt ||
    !article.category ||
    !article.author ||
    !article.slug
  ) {
    throw new Error("title, excerpt, category, author, and slug are required.");
  }

  return article;
}

export function validateProfileInput(value: unknown): ProfileInput {
  const record = asRecord(value);
  const profile = {
    bio: String(record.bio || "").trim(),
    favoriteTeam: String(record.favoriteTeam || "").trim(),
    fullName: String(record.fullName || "").trim(),
  };

  if (!profile.fullName) {
    throw new Error("fullName is required.");
  }

  return profile;
}

export function validateCredentials(value: unknown) {
  const record = asRecord(value);
  const email = String(record.email || "").trim().toLowerCase();
  const password = String(record.password || "");
  const fullName = String(record.fullName || "").trim();
  const redirectTo = sanitizeRedirectPath(String(record.redirectTo || "/profile").trim() || "/profile");

  if (!email || !password) {
    throw new Error("email and password are required.");
  }

  return { email, fullName, password, redirectTo };
}

export { sanitizeRedirectPath };
