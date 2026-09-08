import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

const VISITORS_FILE = path.join(process.cwd(), "src/data/visitors.json");

// Helper to fetch geo-location details with a timeout and fallback API
async function fetchGeoData(ip: string) {
  let queryIp = ip.replace(/^::ffff:/, "").trim();
  const isLocal =
    queryIp === "::1" ||
    queryIp === "127.0.0.1" ||
    queryIp === "localhost" ||
    queryIp === "::" ||
    queryIp.startsWith("10.") ||
    queryIp.startsWith("192.168.") ||
    queryIp.startsWith("172.");

  const defaultGeo = {
    country: "Local Dev",
    countryCode: "US",
    region: "Local",
    city: "Local",
    lat: 0,
    lon: 0,
    isp: "Localhost",
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3-second timeout

  // 1. Try ip-api.com first (reliable free tier, 45 requests/min limit)
  try {
    const url = isLocal ? "http://ip-api.com/json/" : `http://ip-api.com/json/${queryIp}`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        return {
          country: data.country || "Unknown",
          countryCode: data.countryCode || "UN",
          region: data.regionName || "Unknown",
          city: data.city || "Unknown",
          lat: data.lat || 0,
          lon: data.lon || 0,
          isp: data.isp || "Unknown",
        };
      }
    }
  } catch (err) {
    console.error("ip-api.com lookup warning:", err);
  }

  // 2. Try ipapi.co as fallback
  try {
    const fallbackController = new AbortController();
    const fallbackTimeoutId = setTimeout(() => fallbackController.abort(), 3000); // 3-second timeout

    const fallbackUrl = isLocal ? "https://ipapi.co/json/" : `https://ipapi.co/${queryIp}/json/`;
    const response = await fetch(fallbackUrl, { signal: fallbackController.signal });
    clearTimeout(fallbackTimeoutId);

    if (response.ok) {
      const data = await response.json();
      if (!data.error) {
        return {
          country: data.country_name || "Unknown",
          countryCode: data.country || "UN",
          region: data.region || "Unknown",
          city: data.city || "Unknown",
          lat: data.latitude || 0,
          lon: data.longitude || 0,
          isp: data.org || "Unknown",
        };
      }
    }
  } catch (err) {
    console.error("ipapi.co lookup warning:", err);
  }

  return defaultGeo;
}

export async function POST(req: NextRequest) {
  try {
    const { pathname } = await req.json();

    // Determine client IP using Cloudflare, standard proxy, and real IP headers
    let ip =
      req.headers.get("cf-connecting-ip") ||
      req.headers.get("x-client-ip") ||
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      (req as any).ip ||
      "127.0.0.1";

    if (ip.includes(",")) {
      ip = ip.split(",")[0].trim();
    }

    // Get location details
    const geo = await fetchGeoData(ip);

    const record = {
      ip,
      pathname,
      timestamp: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || "Unknown",
      ...geo,
    };

    // Load existing visits
    let visitors = [];
    try {
      const data = await fs.readFile(VISITORS_FILE, "utf-8");
      visitors = JSON.parse(data);
    } catch (err) {
      // Directory may not exist
      await fs.mkdir(path.dirname(VISITORS_FILE), { recursive: true });
    }

    // Append record
    visitors.unshift(record);

    // Limit to last 2000 entries to save disk size/memory
    if (visitors.length > 2000) {
      visitors = visitors.slice(0, 2000);
    }

    await fs.writeFile(VISITORS_FILE, JSON.stringify(visitors, null, 2), "utf-8");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Visitor tracking API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Auth checking helper
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

    let visitors = [];
    try {
      const data = await fs.readFile(VISITORS_FILE, "utf-8");
      visitors = JSON.parse(data);
    } catch (err) {
      // File may not exist yet
    }

    return NextResponse.json({ success: true, visitors });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
