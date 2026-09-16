"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/landing/AuthShell";
import { Field, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/utils";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Enter your email", "We need it to find your account.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      // Show the same success state whether or not that email has an
      // account — telling people "no account with that email" is exactly
      // the kind of signal that lets someone probe which emails are
      // registered on TeamFlow.
      setSent(true);
    } catch (err) {
      toast.error("Couldn't send reset email", getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <AuthShell
        title="Check your email"
        subtitle=""
        footer={
          <>
            Back to{" "}
            <Link href="/login" className="font-medium text-violet hover:underline">
              log in
            </Link>
          </>
        }
      >
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet/10 text-violet">
            <MailCheck size={24} />
          </div>
          <p className="text-[14.5px] leading-relaxed text-muted">
            If an account exists for <span className="font-medium text-text">{email}</span>,
            a password reset link is on its way. Open it from this device to set a new
            password and go straight back into your boards.
          </p>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-medium text-violet hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Email">
          <Input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoFocus
          />
        </Field>
        <Button type="submit" loading={loading} className="w-full">
          Send reset link
        </Button>
      </form>
    </AuthShell>
  );
}
