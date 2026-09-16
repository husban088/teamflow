"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Waypoints, Menu, X, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/features", label: "Features" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Signed-in state, checked client-side so this same Nav works whether the
  // page it's rendered on is a server or a client component. Without this,
  // the marketing pages always showed "Log in" even for a signed-in user —
  // which is exactly why people ended up clicking it again on every visit
  // instead of landing straight on their dashboard/profile.
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setSignedIn(!!data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setSignedIn(!!session?.user);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-40 glass border-b border-line">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2 font-display text-[17px] font-semibold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-gradient text-white transition-transform duration-300 group-hover:rotate-[-8deg] group-hover:scale-105">
            <Waypoints size={16} />
          </span>
          TeamFlow
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-muted sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative transition-colors hover:text-text after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-violet after:transition-all after:duration-300 hover:after:w-full",
                pathname === link.href ? "text-text after:w-full" : "after:w-0"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {signedIn ? (
            <>
              <Link
                href="/dashboard/profile"
                className="hidden items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-text sm:flex"
              >
                <User size={15} />
                Profile
              </Link>
              <Link
                href="/dashboard"
                className="violet-glow rounded-xl bg-violet-gradient px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-muted transition-colors hover:text-text sm:block"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="violet-glow rounded-xl bg-violet-gradient px-4 py-2 text-sm font-medium text-white transition-all hover:brightness-110 hover:-translate-y-0.5"
              >
                Get started
              </Link>
            </>
          )}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="press flex h-9 w-9 items-center justify-center rounded-lg border border-line-solid text-text sm:hidden"
          >
            {open ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-panel sm:hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-3">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-2 py-2.5 text-[14.5px] font-medium transition-colors",
                    pathname === link.href ? "bg-violet/10 text-violet" : "text-muted hover:bg-panel-raised hover:text-text"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              {signedIn ? (
                <Link
                  href="/dashboard/profile"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-[14.5px] font-medium text-muted hover:bg-panel-raised hover:text-text"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2.5 text-[14.5px] font-medium text-muted hover:bg-panel-raised hover:text-text"
                >
                  Log in
                </Link>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
