"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    const response = await fetch("/api/newsletter", {
      body: JSON.stringify({
        email: String(formData.get("email") || ""),
        name: String(formData.get("name") || ""),
      }),
      headers: {
        "content-type": "application/json",
      },
      method: "POST",
    });

    const payload = await response.json();
    setMessage(payload.message || payload.error || "Request completed.");
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-6"
    >
      <div>
        <h3 className="text-lg font-semibold text-slate-900">Free newsletter signup</h3>
        <p className="mt-2 text-sm text-slate-600">Collect readers for breaking news, analysis drops, and local highlights.</p>
      </div>
      <label className="block text-sm font-medium text-slate-700">
        Name
        <input className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" name="name" type="text" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Email
        <input className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3" name="email" type="email" required />
      </label>
      <button className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white" type="submit">
        Join newsletter
      </button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </form>
  );
}
