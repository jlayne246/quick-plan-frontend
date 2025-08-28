"use client";

import { useEffect, useState } from "react";
import { getHello } from "./lib/apiClient";

export default function HomePage() {
    const [message, setMessage] = useState("Loading...");

    useEffect(() => {
      getHello()
        .then((data) => setMessage(data.message))
        .catch((err) => setMessage("Error: " + err.message));
    }, []);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
        <h1 className="text-4xl font-bold mb-4">QuickPlan</h1>
        <h1 className="text-4 font-bold mb-4">AI Course Recommender</h1>
        <p className="text-lg text-gray-700">{message}</p>
        <p className="mt-6 text-gray-500">
          This message comes from the Flask backend.
        </p>
      </div>
    );
}
