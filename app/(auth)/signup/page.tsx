"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/landing/AuthShell";
import { Field, Input, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const supabase = createClient();
  const toast = useToast();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!fullName.trim()) next.fullName = "Enter your full name.";
    if (!email.trim()) next.email = "Enter your email address.";
    if (!password) next.password = "Enter a password.";
    else if (password.length < 6)
      next.password = "Password must be at least 6 characters.";
    if (!confirmPassword) next.confirmPassword = "Confirm your password.";
    else if (password && confirmPassword !== password)
      next.confirmPassword = "Passwords don't match.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (loading) return;

    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error(
        "Check the form",
        "Fix the highlighted fields and try again.",
      );
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: fullName.trim() } },
      });

      if (error) {
        setLoading(false);
        toast.error("Couldn't create your account", error.message);
        return;
      }

      // Session came back right away (email confirmation is off) -> dashboard.
      if (data.session) {
        toast.success("Welcome to TeamFlow", "Your account is ready.");
        // Full page load so the fresh session cookie is sent with the request.
        window.location.assign("/dashboard");
        return;
      }

      // No session yet. Try signing in directly; this works when email
      // confirmation is off but signUp didn't return a session.
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (!signInError) {
        toast.success("Welcome to TeamFlow", "Your account is ready.");
        window.location.assign("/dashboard");
        return;
      }

      // Email confirmation is required by the project: ask the user to confirm.
      setLoading(false);
      toast.success("Check your inbox", "We sent you a confirmation link.");
      setSent(true);
    } catch (err) {
      setLoading(false);
      toast.error(
        "Couldn't create your account",
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    }
  }

  if (sent) {
    return (
      <AuthShell
        showReload
        title="Check your inbox"
        subtitle=""
        footer={
          <Link
            href="/login"
            className="font-medium text-violet hover:underline"
          >
            Back to log in
          </Link>
        }
      >
        <div className="flex items-start gap-2 rounded-xl border border-teal/30 bg-teal/10 px-3.5 py-3 text-[13px] text-teal">
          <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
          We sent a confirmation link to{" "}
          <strong className="font-medium">{email}</strong>. Click it, then come
          back and log in.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      showReload
      title="Create your workspace"
      subtitle="Free for teams of any size. No card needed."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-violet hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field label="Full name" error={errors.fullName}>
          <Input
            invalid={!!errors.fullName}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName)
                setErrors((p) => ({ ...p, fullName: undefined }));
            }}
            placeholder="Ayesha Khan"
            autoComplete="name"
          />
        </Field>
        <Field label="Email" error={errors.email}>
          <Input
            type="email"
            invalid={!!errors.email}
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            placeholder="you@company.com"
          />
        </Field>
        <Field
          label="Password"
          hint="At least 6 characters."
          error={errors.password}
        >
          <PasswordInput
            invalid={!!errors.password}
            autoComplete="new-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((p) => ({ ...p, password: undefined }));
            }}
            placeholder="••••••••"
          />
        </Field>
        <Field label="Confirm password" error={errors.confirmPassword}>
          <PasswordInput
            invalid={!!errors.confirmPassword}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword)
                setErrors((p) => ({ ...p, confirmPassword: undefined }));
            }}
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" loading={loading} className="w-full">
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}
