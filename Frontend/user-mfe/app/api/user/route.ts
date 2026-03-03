const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5001";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization") || "";
    console.log(
      "[v0] Users proxy -> forwarding to:",
      `${BACKEND_URL}/api/user`,
    );

    const res = await fetch(`${BACKEND_URL}/api/user`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
    });

    const data = await res.text();
    console.log("[v0] Users response status:", res.status);

    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[v0] Users proxy error:", error);
    return new Response(
      JSON.stringify({
        message: `Could not connect to backend at ${BACKEND_URL}. Make sure your Spring Boot server is running on port 8080.`,
        status: false,
      }),
      { status: 503, headers: { "Content-Type": "application/json" } },
    );
  }
}
