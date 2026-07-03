"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { requestAdminPasswordReset } from "@/lib/api-admin";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      await requestAdminPasswordReset(email);
      setMessage("Si un compte existe, un email a ete envoye.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'envoyer la demande.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <section className="bo-card w-full p-7">
        <p className="bo-label">Administration</p>
        <h1 className="mt-2 text-2xl font-semibold">Mot de passe oublie</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Demande de reinitialisation du mot de passe admin">
          <div>
            <label htmlFor="email" className="bo-label">Email</label>
            <input id="email" type="email" className="bo-input mt-1" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </div>
          {message ? <p className="text-sm text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-60" disabled={loading}>
            Envoyer le lien
          </button>
        </form>
        <p className="mt-4 text-sm text-stone-600">
          <Link href="/admin/login" className="font-medium text-amber-700 hover:text-amber-800">
            Retour a la connexion
          </Link>
        </p>
      </section>
    </main>
  );
}
