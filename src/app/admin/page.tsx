"use client";

import { useEffect, useState } from "react";
import { LoginForm } from "@/components/admin/login-form";
import { ProfileEditor } from "@/components/admin/profile-editor";
import { CollectionEditor } from "@/components/admin/collection-editor";
import { VisitorStats } from "@/components/admin/visitor-stats";
import { skillIconMap } from "@/lib/icon-map";
import type { Field } from "@/components/admin/field-types";
import { cn } from "@/lib/utils";

const TOKEN_KEY = "admin_token";

const TABS = ["Profile", "Skills", "Experience", "Education", "Certifications", "Projects", "Visitors"] as const;
type Tab = (typeof TABS)[number];

const skillFields: Field[] = [
  { key: "name", label: "Name", type: "text" },
  {
    key: "icon",
    label: "Icon",
    type: "select",
    options: Object.keys(skillIconMap).map((k) => ({ value: k, label: k })),
  },
];

const experienceFields: Field[] = [
  { key: "company", label: "Company", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "href", label: "Company URL", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "logoUrl", label: "Logo URL", type: "text" },
  { key: "start", label: "Start", type: "text", placeholder: "Feb 2026" },
  { key: "end", label: "End (blank = Present)", type: "text" },
  { key: "description", label: "Description (markdown)", type: "textarea" },
];

const educationFields: Field[] = [
  { key: "school", label: "School", type: "text" },
  { key: "degree", label: "Degree", type: "text" },
  { key: "href", label: "School URL", type: "text" },
  { key: "logoUrl", label: "Logo URL", type: "text" },
  { key: "start", label: "Start", type: "text" },
  { key: "end", label: "End", type: "text" },
];

const certificationFields: Field[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "issuer", label: "Issuer", type: "text" },
  { key: "href", label: "URL", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
];

const projectFields: Field[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "href", label: "URL", type: "text" },
  { key: "active", label: "Show on site", type: "boolean" },
  { key: "dates", label: "Dates", type: "text" },
  { key: "description", label: "Description (markdown)", type: "textarea" },
  { key: "technologies", label: "Technologies (comma-separated)", type: "stringArray" },
  { key: "links", label: "Links", type: "linksArray" },
  { key: "image", label: "Image URL", type: "text" },
  { key: "video", label: "Video URL", type: "text" },
];

export default function AdminPage() {
  const [token, setToken] = useState<string | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("Profile");

  useEffect(() => {
    // localStorage isn't available during SSR, so the token must be read
    // client-side after mount rather than via lazy useState initialization.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setToken(localStorage.getItem(TOKEN_KEY));
  }, []);

  const handleLogin = (t: string) => {
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  if (token === undefined) return null;
  if (!token) return <LoginForm onLogin={handleLogin} />;

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="text-xs text-muted-foreground hover:underline">
          Log out
        </button>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border pb-2">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium",
              tab === t ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Profile" && <ProfileEditor token={token} />}
      {tab === "Skills" && (
        <CollectionEditor
          resource="skills"
          title="Skills"
          fields={skillFields}
          token={token}
          emptyValues={{ name: "", icon: "react" }}
          renderLabel={(i) => `${i.name}`}
        />
      )}
      {tab === "Experience" && (
        <CollectionEditor
          resource="experience"
          title="Experience"
          fields={experienceFields}
          token={token}
          emptyValues={{ company: "", title: "", href: "", location: "", logoUrl: "", start: "", end: "", description: "" }}
          renderLabel={(i) => `${i.company} — ${i.title}`}
        />
      )}
      {tab === "Education" && (
        <CollectionEditor
          resource="education"
          title="Education"
          fields={educationFields}
          token={token}
          emptyValues={{ school: "", degree: "", href: "", logoUrl: "", start: "", end: "" }}
          renderLabel={(i) => `${i.school}`}
        />
      )}
      {tab === "Certifications" && (
        <CollectionEditor
          resource="certifications"
          title="Certifications"
          fields={certificationFields}
          token={token}
          emptyValues={{ name: "", issuer: "", href: "", description: "" }}
          renderLabel={(i) => `${i.name}`}
        />
      )}
      {tab === "Projects" && (
        <CollectionEditor
          resource="projects"
          title="Projects"
          fields={projectFields}
          token={token}
          emptyValues={{
            title: "",
            href: "",
            active: true,
            dates: "",
            description: "",
            technologies: [],
            links: [],
            image: "",
            video: "",
          }}
          renderLabel={(i) => `${i.title}`}
        />
      )}
      {tab === "Visitors" && <VisitorStats token={token} />}
    </div>
  );
}
