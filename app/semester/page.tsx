"use client";

import { useEffect, useState } from "react";

export default function Semester() {
    const [years, setYears] = useState<string[]>([]);
    const semesters: Record<string, string> = {
        "1": "Semester 1",
        "2": "Semester 2",
        "S": "Summer",
    };

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const nextYears = Array.from({ length: 4 }, (_, i) => (currentYear + i).toString());
        setYears(nextYears);
    }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <form className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Plan Your Semester</h1>

            {/* Year selection */}
            <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Select Year
            </label>
            <select
                id="year"
                name="year"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
                {years.map((year) => (
                <option key={year} value={year}>
                    {year}
                </option>
                ))}
            </select>
            </div>

            {/* Semester selection */}
            <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                Select Semester
            </label>
            <select
                id="semester"
                name="semester"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
                {Object.entries(semesters).map(([key, label]) => (
                    <option key={key} value={key}>
                        {label}
                    </option>
                ))}
            </select>
            </div>

            {/* Submit button */}
            <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium shadow hover:bg-blue-700 transition"
            >
                Submit
            </button>
        </form>
        </div>
    );
}
