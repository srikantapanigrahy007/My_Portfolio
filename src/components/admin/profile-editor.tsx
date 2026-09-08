"use client";

import { useEffect, useState } from "react";
import { getProfile, updateProfile, type Profile } from "@/lib/api";

const SOCIAL_ICON_OPTIONS = ["github", "linkedin", "x", "email", "globe"];

export function ProfileEditor({ token }: { token: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    getProfile().then(setProfile).catch(() => setStatus("Failed to load profile"));
  }, []);

  if (!profile) return <p className="text-xs text-muted-foreground">Loading...</p>;

  const set = <K extends keyof Profile>(key: K, value: Profile[K]) =>
    setProfile((p) => (p ? { ...p, [key]: value } : p));

  const updateSocial = (index: number, patch: Partial<Profile["socials"][number]>) =>
    setProfile((p) =>
      p
        ? {
            ...p,
            socials: p.socials.map((s, i) => (i === index ? { ...s, ...patch } : s)),
          }
        : p
    );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatus("");
    try {
      const updated = await updateProfile(token, profile);
      setProfile(updated);
      setStatus("Saved.");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      <h3 className="text-sm font-bold">Profile</h3>
      {[
        ["name", "Name"],
        ["initials", "Initials"],
        ["url", "Site URL"],
        ["resumeUrl", "Resume URL"],
        ["avatarUrl", "Avatar URL"],
        ["email", "Email"],
        ["tel", "Phone"],
      ].map(([key, label]) => (
        <label key={key} className="flex flex-col gap-1 text-xs font-medium">
          {label}
          <input
            value={(profile[key as keyof Profile] as string) ?? ""}
            onChange={(e) => set(key as keyof Profile, e.target.value as never)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
        </label>
      ))}
      {[
        ["description", "Short Description"],
        ["heroDescription", "Hero Tagline (markdown)"],
        ["summary", "About Summary (markdown)"],
      ].map(([key, label]) => (
        <label key={key} className="flex flex-col gap-1 text-xs font-medium">
          {label}
          <textarea
            value={(profile[key as keyof Profile] as string) ?? ""}
            onChange={(e) => set(key as keyof Profile, e.target.value as never)}
            rows={key === "summary" ? 5 : 3}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
          />
        </label>
      ))}

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium">Social Links</span>
        {profile.socials.map((social, idx) => (
          <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2">
            <input
              value={social.name}
              onChange={(e) => updateSocial(idx, { name: e.target.value })}
              placeholder="Label"
              className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
            <input
              value={social.url}
              onChange={(e) => updateSocial(idx, { url: e.target.value })}
              placeholder="https://..."
              className="min-w-0 flex-[2] rounded-md border border-border bg-background px-2 py-1 text-xs"
            />
            <select
              value={social.icon}
              onChange={(e) => updateSocial(idx, { icon: e.target.value })}
              className="rounded-md border border-border bg-background px-2 py-1 text-xs"
            >
              {SOCIAL_ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-1 text-xs">
              <input
                type="checkbox"
                checked={social.navbar}
                onChange={(e) => updateSocial(idx, { navbar: e.target.checked })}
              />
              In navbar
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            set("socials", [
              ...profile.socials,
              { key: `link-${Date.now()}`, name: "New Link", url: "", icon: "globe", navbar: false },
            ])
          }
          className="w-fit rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
        >
          + Add social link
        </button>
      </div>

      {status && <p className="text-xs text-muted-foreground">{status}</p>}
      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-md bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </form>
  );
}
