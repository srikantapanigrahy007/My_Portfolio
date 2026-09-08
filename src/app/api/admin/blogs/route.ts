import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

// Custom MDX Frontmatter Parser
function parseMdx(fileContent: string) {
  const lines = fileContent.split(/\r?\n/);
  if (lines[0] !== "---") {
    return { metadata: {} as any, content: fileContent };
  }

  let i = 1;
  const frontmatterLines: string[] = [];
  while (i < lines.length && lines[i] !== "---") {
    frontmatterLines.push(lines[i]);
    i++;
  }

  const content = lines.slice(i + 1).join("\n");
  const metadata: any = { tags: [] };

  let currentKey: string | null = null;

  for (const line of frontmatterLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("-")) {
      if (currentKey) {
        const val = trimmed.substring(1).trim().replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
        if (Array.isArray(metadata[currentKey])) {
          metadata[currentKey].push(val);
        } else {
          metadata[currentKey] = [val];
        }
      }
    } else {
      const colonIdx = line.indexOf(":");
      if (colonIdx !== -1) {
        const key = line.substring(0, colonIdx).trim();
        let val = line.substring(colonIdx + 1).trim();

        if (val.startsWith("-") || !val) {
          metadata[key] = [];
          currentKey = key;
        } else {
          val = val.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
          metadata[key] = val;
          currentKey = key;
        }
      }
    }
  }

  return { metadata, content };
}

// Custom MDX Frontmatter Stringifier
function stringifyMdx(metadata: any, content: string) {
  let str = "---\n";
  for (const [key, value] of Object.entries(metadata)) {
    if (key === "tags" && Array.isArray(value)) {
      str += `${key}:\n`;
      value.forEach((val) => {
        str += `  - ${val}\n`;
      });
    } else if (value !== undefined && value !== null) {
      str += `${key}: "${String(value).replace(/"/g, '\\"')}"\n`;
    }
  }
  str += "---\n\n";
  str += content;
  return str;
}

// Helper: Helper to convert string to URL-safe slug
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

// Auth Helper
async function checkAuth() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  return session === adminPassword;
}

export async function GET() {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await fs.mkdir(CONTENT_DIR, { recursive: true });
      const filenames = await fs.readdir(CONTENT_DIR);
      const mdxFiles = filenames.filter((file) => file.endsWith(".mdx"));

      const blogs = await Promise.all(
        mdxFiles.map(async (filename) => {
          const filepath = path.join(CONTENT_DIR, filename);
          const rawContent = await fs.readFile(filepath, "utf-8");
          const { metadata, content } = parseMdx(rawContent);
          const slug = filename.replace(/\.mdx$/, "");

          return {
            slug,
            title: metadata.title || slug,
            publishedAt: metadata.publishedAt || "",
            summary: metadata.summary || "",
            author: metadata.author || "",
            tags: metadata.tags || [],
            content,
          };
        })
      );

      // Sort blogs by published date descending
      blogs.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

      return NextResponse.json({ success: true, blogs });
    } catch (err) {
      return NextResponse.json({ success: true, blogs: [] });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, publishedAt, summary, author, tags, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug = slugify(title);
    const filepath = path.join(CONTENT_DIR, `${slug}.mdx`);

    // Check if blog already exists
    try {
      await fs.access(filepath);
      return NextResponse.json({ error: "A blog post with this title already exists" }, { status: 400 });
    } catch {
      // File doesn't exist, proceed
    }

    const metadata = {
      title,
      publishedAt: publishedAt || new Date().toISOString().split("T")[0],
      summary: summary || "",
      description: summary || "",
      author: author || "Srikanta Panigrahy",
      tags: tags || [],
    };

    const mdxString = stringifyMdx(metadata, content);
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    await fs.writeFile(filepath, mdxString, "utf-8");

    return NextResponse.json({ success: true, slug });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, title, publishedAt, summary, author, tags, content } = body;

    if (!slug || !title || !content) {
      return NextResponse.json({ error: "Slug, title, and content are required" }, { status: 400 });
    }

    const currentFilepath = path.join(CONTENT_DIR, `${slug}.mdx`);
    const newSlug = slugify(title);
    const targetFilepath = path.join(CONTENT_DIR, `${newSlug}.mdx`);

    // If slug changed, rename or check collision
    if (newSlug !== slug) {
      try {
        await fs.access(targetFilepath);
        return NextResponse.json({ error: "A blog post with the new title already exists" }, { status: 400 });
      } catch {
        // Safe to rename later
      }
    }

    const metadata = {
      title,
      publishedAt: publishedAt || new Date().toISOString().split("T")[0],
      summary: summary || "",
      description: summary || "",
      author: author || "Srikanta Panigrahy",
      tags: tags || [],
    };

    const mdxString = stringifyMdx(metadata, content);

    // If slug changed, delete old file and write to new file
    if (newSlug !== slug) {
      try {
        await fs.unlink(currentFilepath);
      } catch (err) {
        console.error("Failed to delete old file:", err);
      }
    }

    await fs.writeFile(targetFilepath, mdxString, "utf-8");

    return NextResponse.json({ success: true, slug: newSlug });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await checkAuth())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 });
    }

    const filepath = path.join(CONTENT_DIR, `${slug}.mdx`);
    await fs.unlink(filepath);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
