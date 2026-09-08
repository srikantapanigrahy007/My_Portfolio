import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const adminPassword = (process.env.ADMIN_PASSWORD || "admin123").trim();

    if (password === adminPassword) {
      const cookieStore = await cookies();
      const proto = req.headers.get("x-forwarded-proto") || "";
      const isSecure = proto.includes("https") || (process.env.NODE_ENV === "production" && req.nextUrl.protocol === "https:");

      cookieStore.set("admin_session", adminPassword, {
        httpOnly: true,
        secure: isSecure,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: "lax",
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session")?.value;
    const adminPassword = (process.env.ADMIN_PASSWORD || "admin123").trim();

    if (session && session === adminPassword) {
      return NextResponse.json({ authenticated: true });
    }

    return NextResponse.json({ authenticated: false });
  } catch (error: any) {
    return NextResponse.json({ authenticated: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
