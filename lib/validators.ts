function sanitizeRedirectPath(value: string, fallback = "/profile") {
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\") || value.includes("://")) {
    return fallback;
  }

  return value;
}

type ArticleInput = {
  author: string;
  authorSlug: string;
  category: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  isFeatured: boolean;
  league: string;
  publishedAt: string | null;
  readTime?: string;
  slug: string;
  status: "draft" | "published";
  tags: string[];
  team: string;
  title: string;
};

type ProfileInput = {
  fullName: string;
  favoriteTeam?: string;
  bio?: string;
};

type CommentInput = {
  articleSlug: string;
  authorName: string;
  body: string;
};

type NewsletterInput = {
  email: string;
  name: string;
};

function asRecord(value: unknown) {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeArticleStatus(value: unknown): "draft" | "published" {
  return value === "published" ? "published" : "draft";
}

function sanitizeAuthorSlug(value: string, fallback: string) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || fallback;
}

export function validateArticleInput(value: unknown): ArticleInput {
  const record = asRecord(value);
  const title = String(record.title || "").trim();
  const author = String(record.author || "").trim();
  const slug = String(record.slug || "").trim();
  const article = {
    category: String(record.category || "").trim(),
    author,
    authorSlug: sanitizeAuthorSlug(String(record.authorSlug || ""), sanitizeAuthorSlug(author, "staff")),
    content: String(record.content || "").trim(),
    excerpt: String(record.excerpt || "").trim(),
    imageUrl: String(record.imageUrl || "/window.svg").trim() || "/window.svg",
    isFeatured: Boolean(record.isFeatured),
    league: String(record.league || "").trim(),
    publishedAt: record.publishedAt ? String(record.publishedAt) : null,
    readTime: String(record.readTime || "5 min read").trim(),
    slug,
    status: normalizeArticleStatus(record.status),
    tags: asStringArray(record.tags),
    team: String(record.team || "").trim(),
    title,
  };

  if (
    !article.title ||
    !article.content ||
    !article.excerpt ||
    !article.category ||
    !article.author ||
    !article.slug ||
    !article.league
  ) {
    throw new Error("title, excerpt, content, category, author, league, and slug are required.");
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

export function validateCommentInput(value: unknown): CommentInput {
  const record = asRecord(value);
  const comment = {
    articleSlug: String(record.articleSlug || "").trim(),
    authorName: String(record.authorName || "").trim(),
    body: String(record.body || "").trim(),
  };

  if (!comment.articleSlug || !comment.authorName || !comment.body) {
    throw new Error("articleSlug, authorName, and body are required.");
  }

  return comment;
}

export function validateNewsletterInput(value: unknown): NewsletterInput {
  const record = asRecord(value);
  const newsletter = {
    email: String(record.email || "").trim().toLowerCase(),
    name: String(record.name || "").trim(),
  };

  if (!newsletter.email || !newsletter.email.includes("@")) {
    throw new Error("A valid email is required.");
  }

  return newsletter;
}

export { sanitizeAuthorSlug, sanitizeRedirectPath };
