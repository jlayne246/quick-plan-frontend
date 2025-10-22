// api/degrees/route.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";
console.log("API_BASE:", API_BASE);

export const revalidate = 3600; // 1 hour

export async function GET() {
    try {
        const res = await fetch(`${API_BASE}/api/degrees`, {
            next: { revalidate: 3600 }
        });

        if (!res.ok) {
            return new Response("Failed to fetch degrees", { status: res.status });
        }

        const s_data = await res.json();

        return new Response(JSON.stringify(s_data), {
            status: 200,
            headers: { "Content-Type": "application/json", "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400" },
        });
    } catch (error) {
        console.error("Error fetching degrees:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}