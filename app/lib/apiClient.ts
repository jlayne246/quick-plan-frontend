const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getHello() {
    const res = await fetch(`${API_BASE}/api/hello`, {
        cache: "no-store", // don't cache in dev
    });
    if (!res.ok) throw new Error("Failed to fetch hello");
    return res.json();
}
