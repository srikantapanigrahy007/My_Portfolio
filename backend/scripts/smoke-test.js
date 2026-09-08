import { MongoMemoryServer } from "mongodb-memory-server";

const BASE = "http://localhost:4577";

function assert(cond, msg) {
  if (!cond) throw new Error(`FAIL: ${msg}`);
  console.log(`  ok: ${msg}`);
}

async function main() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  process.env.JWT_SECRET = "smoke-test-secret";
  process.env.ADMIN_PASSWORD = "smoke-test-password";
  process.env.PORT = "4577";
  process.env.FRONTEND_URL = "http://localhost:3000";
  process.env.NODE_ENV = "test";

  const { start } = await import("../src/index.js");
  const server = await start();

  try {
    console.log("Health check");
    const health = await fetch(`${BASE}/health`);
    assert(health.status === 200, "GET /health -> 200");

    console.log("Public portfolio aggregate (empty DB)");
    const portfolioRes = await fetch(`${BASE}/api/portfolio`);
    const portfolio = await portfolioRes.json();
    assert(portfolioRes.status === 200, "GET /api/portfolio -> 200");
    assert(Array.isArray(portfolio.skills) && portfolio.skills.length === 0, "skills starts empty");

    console.log("Auth: wrong password rejected");
    const badLogin = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "wrong" }),
    });
    assert(badLogin.status === 401, "wrong password -> 401");

    console.log("Auth: correct password issues a token");
    const loginRes = await fetch(`${BASE}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: "smoke-test-password" }),
    });
    const { token } = await loginRes.json();
    assert(loginRes.status === 200 && typeof token === "string", "correct password -> 200 + token");

    console.log("Skills CRUD requires admin token");
    const unauthedCreate = await fetch(`${BASE}/api/skills`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Rust", icon: "rust" }),
    });
    assert(unauthedCreate.status === 401, "create without token -> 401");

    const createRes = await fetch(`${BASE}/api/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "Rust", icon: "rust" }),
    });
    const created = await createRes.json();
    assert(createRes.status === 201 && created.name === "Rust", "create with token -> 201");

    const listRes = await fetch(`${BASE}/api/skills`);
    const list = await listRes.json();
    assert(list.some((s) => s._id === created._id), "created skill appears in public list");

    const updateRes = await fetch(`${BASE}/api/skills/${created._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: "Rust (updated)" }),
    });
    const updated = await updateRes.json();
    assert(updateRes.status === 200 && updated.name === "Rust (updated)", "update -> 200");

    const deleteRes = await fetch(`${BASE}/api/skills/${created._id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    assert(deleteRes.status === 200, "delete -> 200");

    console.log("Visitor tracking");
    const trackRes = await fetch(`${BASE}/api/visitors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pathname: "/" }),
    });
    assert(trackRes.status === 201, "POST /api/visitors -> 201");

    const statsRes = await fetch(`${BASE}/api/visitors`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const stats = await statsRes.json();
    assert(statsRes.status === 200 && stats.total === 1, "visitor total counted correctly");

    console.log("Contact route (no SMTP configured -> graceful 500)");
    const contactRes = await fetch(`${BASE}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Test", email: "t@example.com", message: "Hi" }),
    });
    assert(contactRes.status === 500, "contact without SMTP config -> 500 (expected, not configured)");

    console.log("\nAll smoke tests passed.");
  } finally {
    await new Promise((resolve) => server.close(resolve));
    await mongod.stop();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
