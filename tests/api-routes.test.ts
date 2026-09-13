import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { handleCreateArticle } from "../app/api/articles/route";
import { handleGetUser, handleUpsertUser } from "../app/api/users/route";

let configured = true;
let currentUser: { id: string; email?: string } | null = null;
let articleInsertError: { code?: string; message: string } | null = null;
let articleInsertResult: Record<string, unknown> | null = null;
let profileUpsertError: { code?: string; message: string } | null = null;
let profileUpsertResult: Record<string, unknown> | null = null;
let lastArticleInsert: Record<string, unknown> | null = null;
let lastProfileUpsert: Record<string, unknown> | null = null;

beforeEach(() => {
  configured = true;
  currentUser = null;
  articleInsertError = null;
  articleInsertResult = { id: "article-1" };
  profileUpsertError = null;
  profileUpsertResult = { id: "user-1" };
  lastArticleInsert = null;
  lastProfileUpsert = null;
});

function createJsonRequest(url: string, body: Record<string, unknown>) {
  return new Request(url, {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "POST",
  });
}

function createValidArticlePayload() {
  return {
    author: "A. Moten",
    category: "NFL",
    content: "Preview content for the full article body.",
    excerpt: "Preview content.",
    league: "Professional Football",
    slug: "preview-content",
    title: "Preview content",
  };
}

const dependencies = {
  createSupabaseServerClient: async () => ({
    from(table: string) {
      if (table === "articles") {
        return {
          insert(rows: Record<string, unknown>[]) {
            lastArticleInsert = rows[0];
            return {
              select() {
                return {
                  single: async () => ({
                    data: articleInsertError ? null : articleInsertResult,
                    error: articleInsertError,
                  }),
                };
              },
            };
          },
        };
      }

      return {
        upsert(payload: Record<string, unknown>) {
          lastProfileUpsert = payload;
          return {
            select() {
              return {
                single: async () => ({
                  data: profileUpsertError ? null : profileUpsertResult,
                  error: profileUpsertError,
                }),
              };
            },
          };
        },
      };
    },
  }),
  getCurrentUser: async () => currentUser,
  isSupabaseConfigured: () => configured,
};

describe("POST /api/articles", () => {
  it("returns 400 for invalid payloads", async () => {
    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", {
        title: "Missing required fields",
      }),
      dependencies,
    );

    assert.equal(response.status, 400);
    assert.equal(lastArticleInsert, null);
  });

  it("returns 503 when Supabase is not configured", async () => {
    configured = false;

    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", createValidArticlePayload()),
      dependencies,
    );

    assert.equal(response.status, 503);
    assert.equal(lastArticleInsert, null);
  });

  it("returns 401 when no user session exists", async () => {
    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", createValidArticlePayload()),
      dependencies,
    );

    assert.equal(response.status, 401);
    assert.equal(lastArticleInsert, null);
  });

  it("returns 409 for duplicate article slugs", async () => {
    currentUser = { id: "user-123", email: "editor@example.com" };
    articleInsertError = { code: "23505", message: "duplicate key value violates unique constraint" };

    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", createValidArticlePayload()),
      dependencies,
    );

    assert.equal(response.status, 409);
  });

  it("returns 403 for article permission failures", async () => {
    currentUser = { id: "user-123", email: "editor@example.com" };
    articleInsertError = { code: "42501", message: "permission denied" };

    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", createValidArticlePayload()),
      dependencies,
    );

    assert.equal(response.status, 403);
  });

  it("creates an article for the authenticated user", async () => {
    currentUser = { id: "user-123", email: "editor@example.com" };

    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", createValidArticlePayload()),
      dependencies,
    );

    assert.equal(response.status, 201);
    assert.equal(lastArticleInsert?.created_by, "user-123");
  });
});

describe("POST /api/users", () => {
  it("returns the current user for the session GET path", async () => {
    currentUser = { id: "user-123", email: "editor@example.com" };

    const response = await handleGetUser({
      getCurrentUser: dependencies.getCurrentUser,
      isSupabaseConfigured: dependencies.isSupabaseConfigured,
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      configured: true,
      user: {
        email: "editor@example.com",
        id: "user-123",
      },
    });
  });

  it("returns a null user for the session GET path when signed out", async () => {
    const response = await handleGetUser({
      getCurrentUser: dependencies.getCurrentUser,
      isSupabaseConfigured: dependencies.isSupabaseConfigured,
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      configured: true,
      user: null,
    });
  });

  it("returns 400 for invalid payloads", async () => {
    const response = await handleUpsertUser(
      createJsonRequest("http://localhost:3000/api/users", {
        favoriteTeam: "Falcons",
      }),
      dependencies,
    );

    assert.equal(response.status, 400);
    assert.equal(lastProfileUpsert, null);
  });

  it("returns 503 when Supabase is not configured", async () => {
    configured = false;

    const response = await handleUpsertUser(
      createJsonRequest("http://localhost:3000/api/users", {
        fullName: "3 Zone Sports",
      }),
      dependencies,
    );

    assert.equal(response.status, 503);
    assert.equal(lastProfileUpsert, null);
  });

  it("returns 401 when no user session exists", async () => {
    const response = await handleUpsertUser(
      createJsonRequest("http://localhost:3000/api/users", {
        fullName: "3 Zone Sports",
      }),
      dependencies,
    );

    assert.equal(response.status, 401);
    assert.equal(lastProfileUpsert, null);
  });

  it("returns 500 when the profile upsert fails", async () => {
    currentUser = { id: "user-123", email: "editor@example.com" };
    profileUpsertError = { message: "database write failed" };

    const response = await handleUpsertUser(
      createJsonRequest("http://localhost:3000/api/users", {
        fullName: "3 Zone Sports",
      }),
      dependencies,
    );

    assert.equal(response.status, 500);
  });

  it("upserts the current user profile", async () => {
    currentUser = { id: "user-123", email: "editor@example.com" };

    const response = await handleUpsertUser(
      createJsonRequest("http://localhost:3000/api/users", {
        bio: "Independent sports media outlet.",
        favoriteTeam: "Atlanta Falcons",
        fullName: "3 Zone Sports",
      }),
      dependencies,
    );

    assert.equal(response.status, 200);
    assert.equal(lastProfileUpsert?.id, "user-123");
    assert.equal(lastProfileUpsert?.full_name, "3 Zone Sports");
  });
});
