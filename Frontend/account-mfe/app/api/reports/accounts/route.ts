const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization") || "";

    const res = await fetch(`${BACKEND_URL}/accounts/report/pdf`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      return new Response(errorText || "Failed to download report", {
        status: res.status,
      });
    }

    const blob = await res.arrayBuffer();

    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=\"comprehensive-account-report.pdf\"",
      },
    });
  } catch (error) {
    console.error("Report proxy error:", error);
    return new Response("Internal server error", { status: 500 });
  }
}

