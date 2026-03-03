const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(
      "[v0] Signup proxy -> forwarding to:",
      `${BACKEND_URL}/auth/signup`,
    );
    console.log("[v0] Signup payload:", JSON.stringify(body));

    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.text();
    console.log("[v0] Signup response status:", res.status);
    console.log("[v0] Signup response body:", data);

    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[v0] Signup proxy error:", error);
    return new Response(
      JSON.stringify({
        message: `Could not connect to backend at ${BACKEND_URL}. Make sure your Spring Boot server is running on port 8080.`,
        status: false,
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }
}
