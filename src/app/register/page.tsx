"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { registerAdmin } from "@/lib/api-admin";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(null);

    try {
      const response = await registerAdmin(name, email, password);
      setSuccess(response.message ?? "Compte admin cree.");
      setTimeout(() => {
        router.push("/admin/login");
      }, 800);
    } catch (err) {
      if (err instanceof Error) {
        try {
          const payload = JSON.parse(err.message) as { error?: string; errors?: Record<string, string> };
          if (payload.errors) {
            setFieldErrors(payload.errors);
            return;
          }
          if (payload.error) {
            setError(payload.error);
            return;
          }
        } catch {
          // fall through to generic error
        }
        setError(err.message);
      } else {
        setError("Erreur lors de l'inscription.");
      }
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <section className="bo-card w-full p-7">
        <p className="bo-label">Administration</p>
        <h1 className="mt-2 text-2xl font-semibold">Creer un compte</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Inscription admin">
          <div>
            <label htmlFor="name" className="bo-label">Nom</label>
            <input id="name" type="text" className="bo-input mt-1" value={name} onChange={(event) => setName(event.target.value)} required />
            {fieldErrors.name ? <p className="mt-1 text-sm text-rose-600">{fieldErrors.name}</p> : null}
          </div>
          <div>
            <label htmlFor="email" className="bo-label">Email</label>
            <input id="email" type="email" className="bo-input mt-1" value={email} onChange={(event) => setEmail(event.target.value)} required />
            {fieldErrors.email ? <p className="mt-1 text-sm text-rose-600">{fieldErrors.email}</p> : null}
          </div>
          <div>
            <label htmlFor="password" className="bo-label">Mot de passe</label>
            <input id="password" type="password" className="bo-input mt-1" value={password} onChange={(event) => setPassword(event.target.value)} required />
            {fieldErrors.password ? <p className="mt-1 text-sm text-rose-600">{fieldErrors.password}</p> : null}
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
          <button type="submit" className="w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">Creer le compte</button>
        </form>
        <p className="mt-4 text-sm text-stone-600">
          Deja un compte ? <Link href="/admin/login" className="font-medium text-amber-700 hover:text-amber-800">Se connecter</Link>
        </p>
      </section>
    </main>
  );
}
