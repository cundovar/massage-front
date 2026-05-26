"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Alert, Button, Card, FormField, Input } from "@/components/admin/ui";
import { loginAdmin } from "@/lib/api-admin";
import { setTokenInStorage } from "@/lib/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await loginAdmin(email, password);
      setTokenInStorage(response.token);
      // Force une navigation complète pour éviter les problèmes de cache
      window.location.href = "/admin";
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5">
      <Card className="w-full">
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Administration</p>
        <h1 className="mt-2 text-2xl font-semibold">Connexion</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Connexion admin">
          <FormField label="Email" htmlFor="email">
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </FormField>
          <FormField label="Mot de passe" htmlFor="password">
            <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          </FormField>
          {error ? <Alert variant="error">{error}</Alert> : null}
          <Button type="submit" className="w-full" loading={loading}>
            Se connecter
          </Button>
        </form>
        <p className="mt-4 text-sm text-stone-600">
          Pas de compte admin ? <Link href="/register" className="font-medium text-amber-700 hover:text-amber-800">Creer un compte</Link>
        </p>
      </Card>
    </main>
  );
}
