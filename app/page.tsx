"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
    const [message, setMessage] = useState("Loading...");
    const router = useRouter();

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-4xl font-bold mb-4">QuickPlan</h1>
        <h1 className="text-4 font-bold mb-4">AI Course Recommender</h1>
        <button
          className="mt-4 rounded bg-yellow-600 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => router.push("/semester")}
        >
          Get Started
        </button>
      </div>
    );
}
