"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { errors?: Record<string, string> } | null;
        if (data?.errors) {
          setErrorMessage(Object.values(data.errors).join(", "));
        } else {
          setErrorMessage("Une erreur est survenue.");
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setErrorMessage("Impossible d'envoyer le message.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <section className="rounded-2xl border border-green-200 bg-green-50 p-6">
        <h2 className="text-2xl text-green-800" style={{ fontFamily: "var(--font-serif)" }}>
          Message envoye !
        </h2>
        <p className="mt-2 text-green-700">Merci pour votre message. Je vous repondrai dans les plus brefs delais.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-4 text-sm text-green-600 underline"
        >
          Envoyer un autre message
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-2xl" style={{ fontFamily: "var(--font-serif)" }}>
        Envoyer un message
      </h2>

      {status === "error" && errorMessage ? (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errorMessage}</div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm text-gray-600" htmlFor="name">
            Nom *
          </label>
          <input
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600" htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600" htmlFor="phone">
            Telephone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm text-gray-600" htmlFor="message">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            value={formData.message}
            onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
            className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={status === "loading"}
          className="button-lift inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffce67] to-[#f67e54] px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
        >
          {status === "loading" ? "Envoi en cours..." : "Envoyer"}
        </button>
      </form>
    </section>
  );
}
