"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  Globe,
  Calendar,
  ShieldAlert,
  Key,
  Monitor,
  FileText,
  User,
  Tags,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import BlurFade from "@/components/magicui/blur-fade";
import Markdown from "react-markdown";

interface VisitorLog {
  ip: string;
  pathname: string;
  timestamp: string;
  userAgent: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  lat: number;
  lon: number;
  isp: string;
}

interface BlogPost {
  slug: string;
  title: string;
  publishedAt: string;
  summary: string;
  author: string;
  tags: string[];
  content: string;
}

export default function AdminDashboard({ adminPath }: { adminPath: string }) {
  // Auth state
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState("");
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<"overview" | "blogs">("overview");

  // Data states
  const [visitors, setVisitors] = useState<VisitorLog[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Blog CRUD state
  const [isBlogFormOpen, setIsBlogFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState("");
  const [blogSummary, setBlogSummary] = useState("");
  const [blogAuthor, setBlogAuthor] = useState("");
  const [blogPublishedAt, setBlogPublishedAt] = useState("");
  const [blogTags, setBlogTags] = useState("");
  const [blogContent, setBlogContent] = useState("");
  const [blogActionError, setBlogActionError] = useState("");
  const [isBlogSaving, setIsBlogSaving] = useState(false);
  const [blogEditorTab, setBlogEditorTab] = useState<"write" | "preview">("write");

  // Check auth session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        setIsAuthenticated(!!data.authenticated);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setIsAuthLoading(false);
      }
    };
    checkSession();
  }, []);

  const fetchData = async () => {
    setIsLoadingData(true);
    try {
      // Fetch Visitor logs
      const logsRes = await fetch("/api/visitor");
      if (logsRes.ok) {
        const logsData = await logsRes.json();
        setVisitors(logsData.visitors || []);
      }

      // Fetch Blogs
      const blogsRes = await fetch("/api/admin/blogs");
      if (blogsRes.ok) {
        const blogsData = await blogsRes.json();
        setBlogs(blogsData.blogs || []);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch dashboard data
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.error || "Incorrect password");
      }
    } catch (err) {
      setAuthError("Failed to authenticate.");
    } finally {
      setIsSubmitLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth", { method: "DELETE" });
      setIsAuthenticated(false);
      setPassword("");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Blog Handlers
  const openNewBlogForm = () => {
    setEditingBlog(null);
    setBlogTitle("");
    setBlogSummary("");
    setBlogAuthor("Srikanta Panigrahy");
    setBlogPublishedAt(new Date().toISOString().split("T")[0]);
    setBlogTags("");
    setBlogContent("");
    setBlogActionError("");
    setBlogEditorTab("write");
    setIsBlogFormOpen(true);
  };

  const openEditBlogForm = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title);
    setBlogSummary(blog.summary);
    setBlogAuthor(blog.author);
    setBlogPublishedAt(blog.publishedAt);
    setBlogTags(blog.tags.join(", "));
    setBlogContent(blog.content);
    setBlogActionError("");
    setBlogEditorTab("write");
    setIsBlogFormOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogActionError("");
    setIsBlogSaving(true);

    const tagsArray = blogTags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      slug: editingBlog?.slug,
      title: blogTitle,
      publishedAt: blogPublishedAt,
      summary: blogSummary,
      author: blogAuthor,
      tags: tagsArray,
      content: blogContent,
    };

    try {
      const url = "/api/admin/blogs";
      const method = editingBlog ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsBlogFormOpen(false);
        fetchData();
      } else {
        setBlogActionError(data.error || "Failed to save blog post");
      }
    } catch (err) {
      setBlogActionError("Server error occurred while saving.");
    } finally {
      setIsBlogSaving(false);
    }
  };

  const handleDeleteBlog = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this blog post?")) return;

    try {
      const res = await fetch(`/api/admin/blogs?slug=${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchData();
      } else {
        alert("Failed to delete blog post");
      }
    } catch (err) {
      alert("Error occurred while deleting");
    }
  };

  // Analytics Aggregation Helpers
  const totalViews = visitors.length;
  const uniqueVisitors = new Set(visitors.map((v) => v.ip)).size;

  const countryStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    visitors.forEach((v) => {
      const country = v.country || "Unknown";
      stats[country] = (stats[country] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [visitors]);

  const pathStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    visitors.forEach((v) => {
      const path = v.pathname || "/";
      stats[path] = (stats[path] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [visitors]);

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const formatLocation = (visit: VisitorLog) => {
    const parts = [];
    if (visit.city && visit.city !== "Local") parts.push(visit.city);
    if (visit.region && visit.region !== "Local") parts.push(visit.region);
    if (visit.country && visit.country !== "Local Dev") parts.push(visit.country);

    return parts.length > 0 ? parts.join(", ") : "Local Host / Unknown";
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center bg-background px-6 font-sans">
        <BlurFade delay={0.05}>
          <div className="w-full max-w-sm p-6 bg-card border border-border rounded-xl flex flex-col gap-6">
            <div className="flex flex-col gap-1.5 text-center">
              <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">
                Sign in to access the portfolio dashboard and manage content securely.
              </p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring text-sm w-full"
                  required
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-destructive flex items-center gap-1 mt-1 font-medium">
                    <ShieldAlert className="size-3.5" />
                    {authError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitLoading}
                className="h-9 rounded-lg bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  "Log In"
                )}
              </button>
            </form>
          </div>
        </BlurFade>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col bg-background text-foreground font-sans gap-8 pb-10">
      {/* Header */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Admin Panel
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze website logs and update your blog articles.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchData}
            disabled={isLoadingData}
            className="h-8 px-3 border border-input bg-background hover:bg-accent text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            {isLoadingData ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              "Refresh"
            )}
          </button>
          <button
            onClick={handleLogout}
            className="h-8 px-3 border border-input bg-background hover:bg-destructive hover:text-destructive-foreground text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </div>
      </section>

      {/* Tabs */}
      <section className="flex border-b border-border gap-4">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "overview"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <LayoutDashboard className="size-4" />
          Visitor Logs
        </button>
        <button
          onClick={() => setActiveTab("blogs")}
          className={`pb-2 text-sm font-semibold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeTab === "blogs"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="size-4" />
          Blog Articles
        </button>
      </section>

      {/* Overview tab */}
      {activeTab === "overview" && (
        <section className="flex flex-col gap-8">
          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-card border border-border rounded-xl">
              <p className="text-xs text-muted-foreground font-semibold">Total Views</p>
              <h2 className="text-2xl font-bold mt-1 tracking-tight">{totalViews}</h2>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl">
              <p className="text-xs text-muted-foreground font-semibold">Unique Visitors</p>
              <h2 className="text-2xl font-bold mt-1 tracking-tight">{uniqueVisitors}</h2>
            </div>
            <div className="p-4 bg-card border border-border rounded-xl col-span-2 md:col-span-1">
              <p className="text-xs text-muted-foreground font-semibold">Published Blogs</p>
              <h2 className="text-2xl font-bold mt-1 tracking-tight">{blogs.length}</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Countries */}
            <div className="p-5 bg-card border border-border rounded-xl flex flex-col gap-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5 border-b border-border/50 pb-2">
                <Globe className="size-4 text-muted-foreground" />
                Countries Share
              </h3>
              <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto">
                {countryStats.length > 0 ? (
                  countryStats.map((item) => {
                    const percentage = totalViews > 0 ? (item.count / totalViews) * 100 : 0;
                    return (
                      <div key={item.name} className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-xs font-medium">
                          <span>{item.name}</span>
                          <span className="text-muted-foreground">
                            {item.count} views ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-1 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-foreground rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">No visitor records found.</p>
                )}
              </div>
            </div>

            {/* Top Visited Pages */}
            <div className="p-5 bg-card border border-border rounded-xl flex flex-col gap-4">
              <h3 className="text-sm font-bold flex items-center gap-1.5 border-b border-border/50 pb-2">
                <FileText className="size-4 text-muted-foreground" />
                Most Visited Paths
              </h3>
              <div className="flex flex-col gap-2.5 max-h-[250px] overflow-y-auto">
                {pathStats.length > 0 ? (
                  pathStats.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-xs pb-1.5 border-b border-border/20 last:border-0 last:pb-0">
                      <span className="font-mono text-muted-foreground flex items-center gap-1.5">
                        <span className="text-foreground font-semibold">{idx + 1}.</span>
                        {item.name}
                      </span>
                      <span className="font-semibold px-2 py-0.5 rounded border border-border text-foreground">
                        {item.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground text-center py-6">No hit analytics recorded.</p>
                )}
              </div>
            </div>
          </div>

          {/* Activity table */}
          <div className="p-5 bg-card border border-border rounded-xl flex flex-col gap-4">
            <h3 className="text-sm font-bold flex items-center gap-1.5 border-b border-border/50 pb-2">
              <Monitor className="size-4 text-muted-foreground" />
              Detailed Activity Log
            </h3>
            
            {/* Scrollable table container */}
            <div className="w-full overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-muted-foreground font-semibold">
                    <th className="py-2.5 px-3">IP Address</th>
                    <th className="py-2.5 px-3">Exact Geolocation</th>
                    <th className="py-2.5 px-3">Route</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.length > 0 ? (
                    visitors.slice(0, 10).map((visit, idx) => (
                      <tr key={idx} className="border-b border-border/30 hover:bg-muted/30 transition-colors last:border-0">
                        <td className="py-2.5 px-3 font-mono">{visit.ip}</td>
                        <td className="py-2.5 px-3 font-medium text-foreground">
                          {formatLocation(visit)}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-muted-foreground">{visit.pathname}</td>
                        <td className="py-2.5 px-3 text-muted-foreground whitespace-nowrap">
                          {formatDate(visit.timestamp)}
                        </td>
                        <td className="py-2.5 px-3 text-muted-foreground truncate max-w-[150px]" title={visit.isp}>
                          {visit.isp || "Unknown"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-muted-foreground">
                        No activity logged yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Blogs Tab */}
      {activeTab === "blogs" && (
        <section className="flex flex-col gap-6">
          {!isBlogFormOpen ? (
            <>
              {/* Blog list */}
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold">All Articles ({blogs.length})</h3>
                <button
                  onClick={openNewBlogForm}
                  className="h-8 px-3 bg-foreground text-background font-semibold rounded-lg text-xs hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="size-4" />
                  New Article
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {blogs.length > 0 ? (
                  blogs.map((blog) => (
                    <div
                      key={blog.slug}
                      className="p-4 bg-card border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                    >
                      <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                          <h4 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                            {blog.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground font-mono bg-muted border border-border px-1.5 py-0.5 rounded">
                            {blog.publishedAt}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{blog.summary}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {blog.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded border border-border/30"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        <Link
                          href={`/blog/${blog.slug}`}
                          target="_blank"
                          className="size-8 rounded-lg border border-input hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                          title="View Live"
                        >
                          <Eye className="size-4" />
                        </Link>
                        <button
                          onClick={() => openEditBlogForm(blog)}
                          className="size-8 rounded-lg border border-input hover:bg-accent text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit className="size-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBlog(blog.slug)}
                          className="size-8 rounded-lg border border-input hover:bg-destructive hover:text-destructive-foreground text-muted-foreground flex items-center justify-center transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 border border-border border-dashed rounded-xl text-center text-muted-foreground bg-card">
                    <BookOpen className="size-8 mx-auto mb-2 text-muted-foreground/30" />
                    <p className="text-sm">Write your first article to display it here.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Edit form */
            <form onSubmit={handleSaveBlog} className="p-5 bg-card border border-border rounded-xl flex flex-col gap-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3.5">
                <h3 className="font-bold text-base">
                  {editingBlog ? `Edit: ${editingBlog.title}` : "Create Blog Article"}
                </h3>
                <div className="flex items-center gap-2">
                  {/* Editor view toggle on mobile */}
                  <div className="flex border border-border rounded-lg overflow-hidden md:hidden">
                    <button
                      type="button"
                      onClick={() => setBlogEditorTab("write")}
                      className={`h-7 px-3 text-xs font-semibold cursor-pointer ${
                        blogEditorTab === "write" ? "bg-accent text-foreground" : "bg-background text-muted-foreground"
                      }`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setBlogEditorTab("preview")}
                      className={`h-7 px-3 text-xs font-semibold cursor-pointer ${
                        blogEditorTab === "preview" ? "bg-accent text-foreground" : "bg-background text-muted-foreground"
                      }`}
                    >
                      Preview
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsBlogFormOpen(false)}
                    className="h-8 px-3 border border-input hover:bg-accent text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {blogActionError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-xs rounded-lg flex items-center gap-1.5">
                  <ShieldAlert className="size-4 shrink-0" />
                  {blogActionError}
                </div>
              )}

              {/* Form Content - Grid based on responsive breakpoint */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Inputs & Textarea Column */}
                <div className={`flex flex-col gap-4 ${blogEditorTab === "preview" ? "hidden md:flex" : "flex"}`}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Article Title</label>
                      <input
                        type="text"
                        placeholder="Article Title"
                        value={blogTitle}
                        onChange={(e) => setBlogTitle(e.target.value)}
                        className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring w-full"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Publish Date</label>
                      <input
                        type="date"
                        value={blogPublishedAt}
                        onChange={(e) => setBlogPublishedAt(e.target.value)}
                        className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring w-full"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Author</label>
                      <input
                        type="text"
                        value={blogAuthor}
                        onChange={(e) => setBlogAuthor(e.target.value)}
                        className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring w-full"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-muted-foreground">Tags (comma-separated)</label>
                      <input
                        type="text"
                        placeholder="Nextjs, Tailwind, React"
                        value={blogTags}
                        onChange={(e) => setBlogTags(e.target.value)}
                        className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring w-full"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-muted-foreground">Summary</label>
                    <textarea
                      placeholder="Short abstract summary..."
                      value={blogSummary}
                      onChange={(e) => setBlogSummary(e.target.value)}
                      className="min-h-[60px] max-h-[100px] p-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring w-full resize-y"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-xs font-bold text-muted-foreground">Markdown Content</label>
                    <textarea
                      placeholder="Write blog body using Markdown..."
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      className="min-h-[300px] md:min-h-[350px] font-mono p-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring w-full resize-y"
                      required
                    />
                  </div>
                </div>

                {/* Preview Column (shows alongside editor on desktop, toggled on mobile) */}
                <div className={`flex flex-col gap-3 rounded-lg border border-border p-4 bg-muted/20 ${blogEditorTab === "write" ? "hidden md:flex" : "flex"}`}>
                  <div className="border-b border-border pb-2">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Live Preview</span>
                    <h2 className="text-xl font-bold mt-1 text-foreground leading-snug">{blogTitle || "Untitled Article"}</h2>
                    <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-2">
                      <span>By {blogAuthor || "Unknown"}</span>
                      <span>&bull;</span>
                      <span>Published: {blogPublishedAt || "Date"}</span>
                    </div>
                    {blogTags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {blogTags.split(",").map((t) => t.trim()).filter((t) => t).map((tag) => (
                          <span key={tag} className="text-[9px] bg-secondary border border-border/30 px-1.5 py-0.5 rounded text-secondary-foreground font-semibold">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none font-sans leading-relaxed text-muted-foreground overflow-y-auto max-h-[500px] pr-1">
                    {blogContent ? (
                      <Markdown>{blogContent}</Markdown>
                    ) : (
                      <p className="italic text-muted-foreground/75">Content preview will render here...</p>
                    )}
                  </div>
                </div>

              </div>

              {/* Form buttons */}
              <div className="border-t border-border pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isBlogSaving}
                  className="h-9 px-5 bg-foreground text-background font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isBlogSaving ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    "Save & Publish"
                  )}
                </button>
              </div>
            </form>
          )}
        </section>
      )}
    </main>
  );
}
