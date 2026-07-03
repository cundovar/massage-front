"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Alert, Button, Card, FormField, Input } from "@/components/admin/ui";
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
      <Card className="w-full">
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Administration</p>
        <h1 className="mt-2 text-2xl font-semibold">Mot de passe oublie</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Demande de reinitialisation du mot de passe admin">
          <FormField label="Email" htmlFor="email">
            <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </FormField>
          {message ? <Alert variant="success">{message}</Alert> : null}
          {error ? <Alert variant="error">{error}</Alert> : null}
          <Button type="submit" className="w-full" loading={loading}>
            Envoyer le lien
          </Button>
        </form>
        <p className="mt-4 text-sm text-stone-600">
          <Link href="/admin/login" className="font-medium text-amber-700 hover:text-amber-800">
            Retour a la connexion
          </Link>
        </p>
      </Card>
    </main>
  );
}
