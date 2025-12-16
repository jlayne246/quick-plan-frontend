// app/api/degrees/route.ts

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.API_BASE_URL || "http://127.0.0.1:5000";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/api/degrees`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return new Response("Failed to fetch degrees", {
        status: res.status,
      });
    }

    const data = await res.json();

    return Response.json(data);
  } catch (error) {
    console.error("Error fetching degrees:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
