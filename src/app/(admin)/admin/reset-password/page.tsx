"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { resetAdminPassword } from "@/lib/api-admin";

function AdminResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(token === "" ? "Lien de reinitialisation invalide." : null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await resetAdminPassword(token, password);
      router.push("/admin/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de reinitialiser le mot de passe.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="bo-card w-full p-7">
      <p className="bo-label">Administration</p>
      <h1 className="mt-2 text-2xl font-semibold">Nouveau mot de passe</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Nouveau mot de passe admin">
        <div>
          <label htmlFor="password" className="bo-label">Nouveau mot de passe</label>
          <input id="password" type="password" className="bo-input mt-1" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" disabled={token === ""} />
        </div>
        <div>
          <label htmlFor="password-confirm" className="bo-label">Confirmation</label>
          <input id="password-confirm" type="password" className="bo-input mt-1" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" disabled={token === ""} />
        </div>
        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        <button type="submit" className="w-full rounded-md bg-amber-500 px-4 py-2 text-white hover:bg-amber-600 disabled:opacity-60" disabled={loading || token === ""}>
          Enregistrer le mot de passe
        </button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        <Link href="/admin/login" className="font-medium text-amber-700 hover:text-amber-800">
          Retour a la connexion
        </Link>
      </p>
    </section>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <Suspense fallback={null}>
        <AdminResetPasswordForm />
      </Suspense>
    </main>
  );
}
