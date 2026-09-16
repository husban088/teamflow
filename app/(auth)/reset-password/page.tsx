"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/landing/AuthShell";
import { Field, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/utils";

export default function ResetPasswordPage() {
  const supabase = createClient();
  const toast = useToast();

  // The recovery link Supabase emails logs the browser into a short-lived
  // session automatically (the ssr client picks up the code/tokens from the
  // URL on load) — we just need to wait for that to land before showing
  // the form, and tell the person plainly if the link turned out to be
  // invalid or already used.
  const [status, setStatus] = useState<"checking" | "ready" | "invalid">("checking");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let settled = false;

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (settled) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        settled = true;
        setStatus("ready");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!settled && data.session) {
        settled = true;
        setStatus("ready");
      }
    });

    // Give the URL-based session exchange a few seconds; if nothing shows
    // up by then the link is genuinely expired/invalid/already used.
    const timeout = setTimeout(() => {
      if (!settled) {
        settled = true;
        setStatus("invalid");
      }
    }, 4000);

    return () => {
      sub.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [supabase]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password too short", "Use at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords don't match", "Type the same password in both fields.");
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated", "Taking you to your boards.");
      // Full page load — same reasoning as login/logout elsewhere in the
      // app: guarantees the refreshed session cookie is attached before
      // middleware checks it on the very next request.
      window.location.assign("/dashboard");
    } catch (err) {
      toast.error("Couldn't update password", getErrorMessage(err));
      setSaving(false);
    }
  }

  if (status === "checking") {
    return (
      <AuthShell title="Verifying link" subtitle="One moment..." footer={null}>
        <div className="flex justify-center py-4">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-violet border-t-transparent" />
        </div>
      </AuthShell>
    );
  }

  if (status === "invalid") {
    return (
      <AuthShell
        title="Link expired"
        subtitle=""
        footer={
          <Link href="/forgot-password" className="font-medium text-violet hover:underline">
            Request a new link
          </Link>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-coral/10 text-coral">
            <AlertTriangle size={24} />
          </div>
          <p className="text-[14.5px] leading-relaxed text-muted">
            This reset link is invalid or has already been used. Request a new one and open
            it on this device.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Set a new password"
      subtitle="Choose a new password for your account."
      footer={null}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="New password" hint="At least 6 characters.">
          <PasswordInput
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoFocus
          />
        </Field>
        <Field label="Confirm new password">
          <PasswordInput
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" loading={saving} className="w-full">
          Update password
        </Button>
      </form>
    </AuthShell>
  );
}
