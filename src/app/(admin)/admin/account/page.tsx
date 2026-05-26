"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, FormField, Input, Spinner } from "@/components/admin/ui";
import { fetchAdminApi, updateAdminAccount, updateAdminPassword, type AdminMeResponse } from "@/lib/api-admin";
import { clearTokenFromStorage, getTokenFromStorage } from "@/lib/auth";

export default function AdminAccountPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [account, setAccount] = useState<AdminMeResponse | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [passwordCurrent, setPasswordCurrent] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingAccount, setSavingAccount] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [accountMessage, setAccountMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = getTokenFromStorage();
    setToken(storedToken);

    if (!storedToken) {
      router.replace("/admin/login");
      return;
    }

    fetchAdminApi<AdminMeResponse>("/api/admin/me", storedToken)
      .then((data) => {
        setAccount(data);
        setName(data.name);
        setEmail(data.email);
      })
      .catch((err: Error) => {
        if (err.message === "UNAUTHORIZED") {
          clearTokenFromStorage();
          router.replace("/admin/login");
          return;
        }
        setAccountError("Impossible de charger votre compte.");
      })
      .finally(() => setLoading(false));
  }, [router]);

  function forceRelogin() {
    clearTokenFromStorage();
    router.replace("/admin/login");
  }

  async function handleAccountSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token || !account) return;

    setSavingAccount(true);
    setAccountError(null);
    setAccountMessage(null);

    try {
      const emailChanged = email.trim().toLowerCase() !== account.email;
      const updated = await updateAdminAccount(token, {
        name,
        email,
        currentPassword: emailChanged ? currentPassword : undefined,
      });

      if (updated.requiresLogin) {
        forceRelogin();
        return;
      }

      setAccount(updated);
      setName(updated.name);
      setEmail(updated.email);
      setCurrentPassword("");
      setAccountMessage("Compte mis a jour.");
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        forceRelogin();
        return;
      }
      setAccountError(err instanceof Error ? err.message : "Impossible de modifier le compte.");
    } finally {
      setSavingAccount(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!token) return;

    setSavingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux mots de passe ne correspondent pas.");
      setSavingPassword(false);
      return;
    }

    try {
      const updated = await updateAdminPassword(token, {
        currentPassword: passwordCurrent,
        newPassword,
      });

      if (updated.requiresLogin) {
        forceRelogin();
        return;
      }

      setPasswordCurrent("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordMessage("Mot de passe mis a jour.");
    } catch (err) {
      if (err instanceof Error && err.message === "UNAUTHORIZED") {
        forceRelogin();
        return;
      }
      setPasswordError(err instanceof Error ? err.message : "Impossible de modifier le mot de passe.");
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center text-stone-500">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-sm text-stone-500">Backoffice</p>
        <h1 className="mt-1 text-2xl font-semibold text-stone-950">Mon compte</h1>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-stone-950">Identifiants</h2>
        <form onSubmit={handleAccountSubmit} className="mt-5 space-y-4">
          <FormField label="Nom" htmlFor="account-name">
            <Input id="account-name" value={name} onChange={(event) => setName(event.target.value)} required autoComplete="name" />
          </FormField>

          <FormField label="Email de connexion" htmlFor="account-email">
            <Input id="account-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" />
          </FormField>

          <FormField label="Mot de passe actuel" htmlFor="account-current-password">
            <Input
              id="account-current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              autoComplete="current-password"
            />
          </FormField>

          {accountError ? <Alert variant="error">{accountError}</Alert> : null}
          {accountMessage ? <Alert variant="success">{accountMessage}</Alert> : null}

          <Button type="submit" loading={savingAccount}>
            Enregistrer
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-stone-950">Mot de passe</h2>
        <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
          <FormField label="Mot de passe actuel" htmlFor="password-current">
            <Input id="password-current" type="password" value={passwordCurrent} onChange={(event) => setPasswordCurrent(event.target.value)} required autoComplete="current-password" />
          </FormField>

          <FormField label="Nouveau mot de passe" htmlFor="password-new">
            <Input id="password-new" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
          </FormField>

          <FormField label="Confirmation" htmlFor="password-confirm">
            <Input id="password-confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required minLength={8} autoComplete="new-password" />
          </FormField>

          {passwordError ? <Alert variant="error">{passwordError}</Alert> : null}
          {passwordMessage ? <Alert variant="success">{passwordMessage}</Alert> : null}

          <Button type="submit" loading={savingPassword}>
            Modifier le mot de passe
          </Button>
        </form>
      </Card>
    </div>
  );
}
