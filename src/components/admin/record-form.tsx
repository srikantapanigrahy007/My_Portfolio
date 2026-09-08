"use client";

import { useState } from "react";
import type { Field, FormValues } from "./field-types";

const LINK_ICON_OPTIONS = ["globe", "github", "linkedin", "x", "email"];

function LinksArrayField({
  value,
  onChange,
}: {
  value: { type: string; href: string; icon: string }[];
  onChange: (v: { type: string; href: string; icon: string }[]) => void;
}) {
  const rows = value.length ? value : [];

  const update = (idx: number, patch: Partial<{ type: string; href: string; icon: string }>) => {
    onChange(rows.map((r, i) => (i === idx ? { ...r, ...patch } : r)));
  };

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, idx) => (
        <div key={idx} className="flex flex-wrap items-center gap-2 rounded-lg border border-border p-2">
          <input
            value={row.type}
            onChange={(e) => update(idx, { type: e.target.value })}
            placeholder="Label (e.g. Website)"
            className="min-w-0 flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
          <input
            value={row.href}
            onChange={(e) => update(idx, { href: e.target.value })}
            placeholder="https://..."
            className="min-w-0 flex-[2] rounded-md border border-border bg-background px-2 py-1 text-xs"
          />
          <select
            value={row.icon}
            onChange={(e) => update(idx, { icon: e.target.value })}
            className="rounded-md border border-border bg-background px-2 py-1 text-xs"
          >
            {LINK_ICON_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onChange(rows.filter((_, i) => i !== idx))}
            className="text-xs text-destructive hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...rows, { type: "Website", href: "", icon: "globe" }])}
        className="w-fit rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
      >
        + Add link
      </button>
    </div>
  );
}

export function RecordForm({
  fields,
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Save",
}: {
  fields: Field[];
  initial: FormValues;
  onSubmit: (values: FormValues) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<FormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: unknown) => setValues((v) => ({ ...v, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...values };
      for (const field of fields) {
        if (field.type === "stringArray" && typeof payload[field.key] === "string") {
          payload[field.key] = (payload[field.key] as string)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      await onSubmit(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-lg border border-border p-4">
      {fields.map((field) => {
        const val = values[field.key];
        return (
          <label key={field.key} className="flex flex-col gap-1 text-xs font-medium text-foreground">
            {field.label}
            {field.type === "text" && (
              <input
                value={(val as string) ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => set(field.key, e.target.value)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              />
            )}
            {field.type === "textarea" && (
              <textarea
                value={(val as string) ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => set(field.key, e.target.value)}
                rows={4}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              />
            )}
            {field.type === "boolean" && (
              <input
                type="checkbox"
                checked={Boolean(val)}
                onChange={(e) => set(field.key, e.target.checked)}
                className="size-4 self-start"
              />
            )}
            {field.type === "select" && (
              <select
                value={(val as string) ?? field.options[0]?.value}
                onChange={(e) => set(field.key, e.target.value)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              >
                {field.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
            {field.type === "stringArray" && (
              <input
                value={Array.isArray(val) ? val.join(", ") : ((val as string) ?? "")}
                placeholder={field.placeholder || "Comma-separated"}
                onChange={(e) => set(field.key, e.target.value)}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              />
            )}
            {field.type === "linksArray" && (
              <LinksArrayField
                value={(val as { type: string; href: string; icon: string }[]) ?? []}
                onChange={(v) => set(field.key, v)}
              />
            )}
          </label>
        );
      })}
      {error && <p className="text-xs text-destructive">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground disabled:opacity-60"
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
