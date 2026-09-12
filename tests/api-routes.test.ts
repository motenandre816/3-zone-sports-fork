import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { handleCreateArticle } from "../app/api/articles/route";
import { handleUpsertUser } from "../app/api/users/route";

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

  it("returns 401 when no user session exists", async () => {
    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", {
        author: "A. Moten",
        category: "NFL",
        excerpt: "Preview content.",
        slug: "preview-content",
        title: "Preview content",
      }),
      dependencies,
    );

    assert.equal(response.status, 401);
    assert.equal(lastArticleInsert, null);
  });

  it("creates an article for the authenticated user", async () => {
    currentUser = { id: "user-123", email: "editor@example.com" };

    const response = await handleCreateArticle(
      createJsonRequest("http://localhost:3000/api/articles", {
        author: "A. Moten",
        category: "NFL",
        excerpt: "Preview content.",
        slug: "preview-content",
        title: "Preview content",
      }),
      dependencies,
    );

    assert.equal(response.status, 201);
    assert.equal(lastArticleInsert?.created_by, "user-123");
  });
});

describe("POST /api/users", () => {
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

    assert.equal(response.status, 201);
    assert.equal(lastProfileUpsert?.id, "user-123");
    assert.equal(lastProfileUpsert?.full_name, "3 Zone Sports");
  });
});
