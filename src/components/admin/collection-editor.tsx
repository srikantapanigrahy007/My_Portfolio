"use client";

import { useEffect, useState } from "react";
import { listResource, createResource, updateResource, deleteResource } from "@/lib/api";
import type { Field, FormValues } from "./field-types";
import { RecordForm } from "./record-form";

export function CollectionEditor({
  resource,
  title,
  fields,
  token,
  emptyValues,
  renderLabel,
}: {
  resource: string;
  title: string;
  fields: Field[];
  token: string;
  emptyValues: FormValues;
  renderLabel: (item: FormValues) => string;
}) {
  const [items, setItems] = useState<FormValues[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const data = await listResource<FormValues>(resource);
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    }
  };

  useEffect(() => {
    // Fetch-on-mount: intentional, standard data-loading effect. `load` is
    // stable in behavior across renders, so it's deliberately omitted here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource]);

  const handleCreate = async (values: FormValues) => {
    await createResource(resource, token, values);
    setAdding(false);
    await load();
  };

  const handleUpdate = async (id: string, values: FormValues) => {
    await updateResource(resource, id, token, values);
    setEditingId(null);
    await load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    await deleteResource(resource, id, token);
    await load();
  };

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold">{title}</h3>
      {error && <p className="text-xs text-destructive">{error}</p>}
      {items === null ? (
        <p className="text-xs text-muted-foreground">Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item._id as string} className="rounded-lg border border-border p-2">
              {editingId === item._id ? (
                <RecordForm
                  fields={fields}
                  initial={item}
                  submitLabel="Update"
                  onSubmit={(values) => handleUpdate(item._id as string, values)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm">{renderLabel(item)}</span>
                  <div className="flex gap-2 text-xs">
                    <button
                      onClick={() => setEditingId(item._id as string)}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id as string)}
                      className="text-destructive hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {adding ? (
        <RecordForm
          fields={fields}
          initial={emptyValues}
          submitLabel="Add"
          onSubmit={handleCreate}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-fit rounded-md border border-dashed border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary"
        >
          + Add {title.toLowerCase().replace(/s$/, "")}
        </button>
      )}
    </div>
  );
}
