const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function getHello() {
    const res = await fetch(`${API_BASE}/api/hello`, {
        cache: "no-store", // don't cache in dev
    });
    if (!res.ok) throw new Error("Failed to fetch hello");
    return res.json();
}

export async function getCoursesBySemester(selectedSemester: number) {
    const res = await fetch(`${API_BASE}/api/courses?semester=${selectedSemester}`, {
        cache: "no-store", // don't cache in dev
    });
    if (!res.ok) throw new Error("Failed to fetch courses");
    return res.json();
}

export async function getAllDegrees() {
    const res = await fetch("/api/degrees", { // Hits our own API route to check for local cache
        next: { revalidate: 3600 }, // optional client hint
    });

    if (!res.ok) {
        throw new Error("Failed to fetch degrees");
    }

    const data = await res.json();
    return { data };
}

export async function getDegreeById(degreeId: number) {
    const res = await fetch(`${API_BASE}/api/degrees/${degreeId}`, {
        cache: "no-store", // don't cache in dev
    });
    if (!res.ok) throw new Error("Failed to fetch degree");
    return res.json();
}

export async function getAllFaculties() {
    const res = await fetch(`${API_BASE}/api/faculties`, {
        cache: "no-store", // don't cache in dev
    });
    if (!res.ok) throw new Error("Failed to fetch faculties");
    return res.json();
}
