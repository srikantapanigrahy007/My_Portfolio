export type Field =
  | { key: string; label: string; type: "text"; placeholder?: string }
  | { key: string; label: string; type: "textarea"; placeholder?: string }
  | { key: string; label: string; type: "boolean" }
  | { key: string; label: string; type: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; type: "stringArray"; placeholder?: string }
  | { key: string; label: string; type: "linksArray" };

export type FormValues = Record<string, unknown>;
