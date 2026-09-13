"use client";

import { useState } from "react";

type CommentFormProps = {
  articleSlug: string;
};

export function CommentForm({ articleSlug }: CommentFormProps) {
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    const response = await fetch("/api/comments", {
      body: JSON.stringify({
        articleSlug,
        authorName: String(formData.get("authorName") || ""),
        body: String(formData.get("body") || ""),
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    const payload = await response.json();
    setMessage(payload.message || payload.error || "Comment submitted.");
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Join the conversation</h3>
      <label className="block text-sm font-medium text-slate-700">
        Name
        <input className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" name="authorName" type="text" required />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Comment
        <textarea className="mt-2 min-h-32 w-full rounded-2xl border border-slate-300 px-4 py-3" name="body" required />
      </label>
      <button className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white" type="submit">
        Post comment
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
