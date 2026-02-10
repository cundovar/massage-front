"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/api-admin";
import { setTokenInStorage } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@helene-massage.fr");
  const [password, setPassword] = useState("ChangeMe123!");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const response = await loginAdmin(email, password);
      setTokenInStorage(response.token);
      // Petit délai pour s'assurer que le token est bien stocké
      await new Promise((resolve) => setTimeout(resolve, 100));
      router.push("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <section className="bo-card w-full p-7">
        <p className="bo-label">Administration</p>
        <h1 className="mt-2 text-2xl font-semibold">Connexion</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Connexion admin">
          <div>
            <label htmlFor="email" className="bo-label">Email</label>
            <input id="email" type="email" className="bo-input mt-1" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>
          <div>
            <label htmlFor="password" className="bo-label">Mot de passe</label>
            <input id="password" type="password" className="bo-input mt-1" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </div>
          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          <button type="submit" className="w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600">Se connecter</button>
        </form>
        <p className="mt-4 text-sm text-stone-600">
          Pas de compte admin ? <Link href="/register" className="font-medium text-amber-700 hover:text-amber-800">Creer un compte</Link>
        </p>
      </section>
    </main>
  );
}
