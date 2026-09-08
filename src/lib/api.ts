export const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export interface Social {
  key: string;
  name: string;
  url: string;
  icon: string;
  navbar: boolean;
}

export interface Profile {
  name: string;
  initials: string;
  url: string;
  resumeUrl: string;
  avatarUrl: string;
  description: string;
  summary: string;
  heroDescription: string;
  email: string;
  tel: string;
  socials: Social[];
}

export interface Skill {
  _id: string;
  name: string;
  icon: string;
  order: number;
}

export interface Experience {
  _id: string;
  company: string;
  href: string;
  location: string;
  title: string;
  logoUrl: string;
  start: string;
  end: string;
  description: string;
  order: number;
}

export interface Education {
  _id: string;
  school: string;
  href: string;
  degree: string;
  logoUrl: string;
  start: string;
  end: string;
  order: number;
}

export interface Certification {
  _id: string;
  name: string;
  issuer: string;
  href: string;
  description: string;
  order: number;
}

export interface ProjectLink {
  type: string;
  href: string;
  icon: string;
}

export interface Project {
  _id: string;
  title: string;
  href: string;
  active: boolean;
  description: string;
  dates: string;
  technologies: string[];
  links: ProjectLink[];
  image: string;
  video: string;
  order: number;
}

export interface PortfolioData {
  profile: Profile | null;
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  certifications: Certification[];
  projects: Project[];
}

// Used when the backend is unreachable (down, not configured yet, etc) so
// the site still renders instead of crashing.
export const FALLBACK_DATA: PortfolioData = {
  profile: {
    name: "Srikanta Panigrahy",
    initials: "SP",
    url: "https://srikantapanigrahy.com",
    resumeUrl: "/Srikanta_Panigrahy_SDE.pdf",
    avatarUrl: "/srikanta-panigrahy.png",
    description:
      "Srikanta Panigrahy is a Full Stack Developer building production-grade web applications with React.js, Node.js, Express.js, and MongoDB.",
    summary:
      "I'm **Srikanta Panigrahy**, a **Full Stack Developer** with hands-on experience building and deploying production-grade web applications using **React.js, Node.js, Express.js, and MongoDB**.",
    heroDescription:
      "**Full Stack Developer** specializing in **React.js**, **Node.js**, **Express.js**, and **MongoDB**.",
    email: "srikantapanigrahy0760@gmail.com",
    tel: "+91 9337883281",
    socials: [
      { key: "GitHub", name: "Github", url: "https://github.com/srikantapanigrahy007", icon: "github", navbar: true },
      { key: "LinkedIn", name: "LinkedIn", url: "https://www.linkedin.com/in/srikanta-panigrahy07/", icon: "linkedin", navbar: true },
      { key: "X", name: "X", url: "https://x.com/Srikanta_2004", icon: "x", navbar: true },
    ],
  },
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  projects: [],
};

export async function getPortfolioData(): Promise<PortfolioData> {
  if (!API_URL) return FALLBACK_DATA;

  try {
    const res = await fetch(`${API_URL}/api/portfolio`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return FALLBACK_DATA;
    const data = (await res.json()) as PortfolioData;
    if (!data.profile) return FALLBACK_DATA;
    return data;
  } catch {
    return FALLBACK_DATA;
  }
}

// ---- Admin (client-side) helpers ----

export class ApiError extends Error {}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || data.message || `Request failed (${res.status})`);
  }
  return data as T;
}

export const adminLogin = (password: string) =>
  request<{ token: string }>("/api/auth/login", { method: "POST", body: { password } });

export const listResource = <T>(resource: string) => request<T[]>(`/api/${resource}`);

export const createResource = <T>(resource: string, token: string, body: unknown) =>
  request<T>(`/api/${resource}`, { method: "POST", body, token });

export const updateResource = <T>(resource: string, id: string, token: string, body: unknown) =>
  request<T>(`/api/${resource}/${id}`, { method: "PUT", body, token });

export const deleteResource = (resource: string, id: string, token: string) =>
  request<{ success: boolean }>(`/api/${resource}/${id}`, { method: "DELETE", token });

export const getProfile = () => request<Profile>("/api/profile");

export const updateProfile = (token: string, body: Partial<Profile>) =>
  request<Profile>("/api/profile", { method: "PUT", body, token });

export const getVisitorStats = (token: string) =>
  request<{ total: number; recent: Array<{ pathname: string; timestamp: string; country: string; city: string }> }>(
    "/api/visitors",
    { token }
  );

export const trackVisit = (pathname: string) => {
  if (!API_URL) return;
  fetch(`${API_URL}/api/visitors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ pathname }),
    keepalive: true,
  }).catch(() => {});
};

export const submitContact = (body: { name: string; email: string; message: string }) =>
  request<{ message: string }>("/api/contact", { method: "POST", body });
