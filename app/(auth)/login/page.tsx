"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthShell } from "@/components/landing/AuthShell";
import { Field, Input, PasswordInput } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";

interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const supabase = createClient();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!email.trim()) next.email = "Enter your email address.";
    if (!password) next.password = "Enter your password.";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) {
      toast.error("Check the form", "Fix the highlighted fields and try again.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (error) {
      toast.error("Couldn't log you in", error.message);
      return;
    }
    toast.success("Welcome back", "Taking you to your boards.");
    // A soft router.replace() here used to need two clicks: signInWithPassword
    // resolves before the browser has finished writing the new session into
    // the cookie the middleware reads, so the very next navigation could
    // still see "no user" and bounce back to /login. A full page load makes
    // the browser send the request with the cookie already attached, so
    // /dashboard's middleware check always sees the fresh session on the
    // first try.
    window.location.assign("/dashboard");
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to see what your team moved overnight."
      footer={
        <>
          New to TeamFlow?{" "}
          <Link href="/signup" className="font-medium text-violet hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
        <Field label="Password" error={errors.password}>
          <PasswordInput
            invalid={!!errors.password}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
            }}
            placeholder="••••••••"
          />
        </Field>
        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            className="text-[13px] font-medium text-violet hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit" loading={loading} className="w-full">
          Log in
        </Button>
      </form>
    </AuthShell>
  );
}
