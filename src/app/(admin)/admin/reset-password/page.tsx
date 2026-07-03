"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Alert, Button, Card, FormField, Input } from "@/components/admin/ui";
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
    <Card className="w-full">
      <p className="text-xs font-medium uppercase tracking-wider text-stone-500">Administration</p>
      <h1 className="mt-2 text-2xl font-semibold">Nouveau mot de passe</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4" aria-label="Nouveau mot de passe admin">
        <FormField label="Nouveau mot de passe" htmlFor="password">
          <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={8} autoComplete="new-password" disabled={token === ""} />
        </FormField>
        <FormField label="Confirmation" htmlFor="password-confirm">
          <Input id="password-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" disabled={token === ""} />
        </FormField>
        {error ? <Alert variant="error">{error}</Alert> : null}
        <Button type="submit" className="w-full" loading={loading} disabled={token === ""}>
          Enregistrer le mot de passe
        </Button>
      </form>
      <p className="mt-4 text-sm text-stone-600">
        <Link href="/admin/login" className="font-medium text-amber-700 hover:text-amber-800">
          Retour a la connexion
        </Link>
      </p>
    </Card>
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
