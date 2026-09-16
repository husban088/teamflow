"use client";

import { useState, FormEvent } from "react";
import { CldUploadButton } from "next-cloudinary";
import { LogOut, Trash2, Camera } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Avatar } from "@/components/ui/Avatar";
import { Field, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { useToast } from "@/components/ui/Toast";
import { getErrorMessage } from "@/lib/utils";

export function ProfileForm({
  userId,
  email,
  fullName,
  avatarUrl,
  createdAt,
}: {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  createdAt: string;
}) {
  const supabase = createClient();
  const toast = useToast();

  const [name, setName] = useState(fullName);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dirty = name.trim() !== (fullName || "") || avatar !== avatarUrl;

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name required", "Give yourself a display name first.");
      return;
    }
    setSaving(true);
    try {
      // RLS policy "users can update their own profile" (auth.uid() = id)
      // is what makes this safe to run straight from the browser.
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: name.trim(), avatar_url: avatar })
        .eq("id", userId);
      if (error) throw error;
      toast.success("Profile updated", "Your changes are saved.");
      // Sidebar/Nav read the profile from the server on navigation, so a
      // refresh picks up the new name/photo everywhere else immediately.
      window.location.reload();
    } catch (err) {
      toast.error("Couldn't save profile", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    // Full page load, not router.push — see Sidebar.handleLogout for why:
    // it guarantees the session cookie is actually gone before anything
    // else renders, so the next visit genuinely asks to sign in again.
    window.location.assign("/");
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Failed to delete account.");
      // Account (and everything owned by it — boards, tasks, comments,
      // attachments) is gone from Supabase now. Drop any local session
      // state and send them to a fully logged-out landing page.
      window.location.assign("/");
    } catch (err) {
      toast.error("Couldn't delete account", getErrorMessage(err));
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <form
        onSubmit={handleSave}
        className="rounded-2xl border border-line-solid bg-panel/60 p-6 sm:p-7"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar name={name || email} src={avatar} size={64} />
            <CldUploadButton
              uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
              options={{ maxFiles: 1, resourceType: "image" }}
              onSuccess={(result) => {
                const info = result?.info;
                if (info && typeof info === "object" && "secure_url" in info) {
                  setAvatar(info.secure_url as string);
                }
              }}
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-line-solid bg-panel-raised text-muted transition-colors hover:text-violet"
            >
              <Camera size={12} />
            </CldUploadButton>
          </div>
          <div className="min-w-0">
            <p className="text-[13.5px] font-medium text-text">Profile photo</p>
            <p className="text-[12.5px] text-muted-dim">
              Click the camera icon to upload a new one.
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <Field label="Full name">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </Field>
          <Field label="Email" hint="Managed by your account sign-in — contact support to change it.">
            <Input value={email} disabled readOnly className="opacity-60" />
          </Field>
          <p className="text-[12px] text-muted-dim">
            Member since{" "}
            {new Date(createdAt).toLocaleDateString(undefined, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit" loading={saving} disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </form>

      <div className="rounded-2xl border border-line-solid bg-panel/60 p-6 sm:p-7">
        <h2 className="font-display text-[15px] font-semibold">Session</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Sign out of TeamFlow on this device.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          loading={loggingOut}
          onClick={handleLogout}
        >
          <LogOut size={15} />
          Log out
        </Button>
      </div>

      <div className="rounded-2xl border border-coral/30 bg-coral/5 p-6 sm:p-7">
        <h2 className="font-display text-[15px] font-semibold text-coral">Danger zone</h2>
        <p className="mt-1 text-[13.5px] text-muted">
          Permanently delete your account, boards you own, and everything on them. This
          can&apos;t be undone.
        </p>
        <Button
          type="button"
          variant="danger"
          className="mt-4"
          onClick={() => setShowDeleteConfirm(true)}
        >
          <Trash2 size={15} />
          Delete account
        </Button>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete your account?"
        confirmLabel="Delete account"
        description="This permanently deletes your TeamFlow account, every board you own, and all of their tasks, comments and files — for everyone on those boards. This can't be undone."
      />
    </div>
  );
}
