"use client";

import { useState, FormEvent } from "react";
import { Nav } from "@/components/landing/Nav";
import { Footer } from "@/components/landing/CtaFooter";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error();
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="grain min-h-dvh">
      <Nav />
      <main className="mx-auto max-w-lg px-5 py-16 sm:px-8 sm:py-24">
        <h1 className="font-display text-[2rem] font-semibold tracking-tight">Get in touch</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Questions about TeamFlow, a bug to report, or feedback on a board
          you&apos;re running — send it over and we&apos;ll reply by email.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          {status === "sent" && (
            <div className="flex items-start gap-2 rounded-xl border border-teal/30 bg-teal/10 px-3.5 py-2.5 text-[13px] text-teal">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
              Message sent — we&apos;ll get back to you soon.
            </div>
          )}
          {status === "error" && (
            <div className="flex items-start gap-2 rounded-xl border border-coral/30 bg-coral/10 px-3.5 py-2.5 text-[13px] text-coral">
              <AlertCircle size={15} className="mt-0.5 shrink-0" />
              Something went wrong sending that. Please try again.
            </div>
          )}
          <Field label="Name">
            <Input required value={name} onChange={(e) => setName(e.target.value)} />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field label="Message">
            <Textarea
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </Field>
          <Button type="submit" loading={status === "sending"} className="w-full">
            Send message
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
}
