"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Degree } from "../lib/types";
import { getAllDegrees } from "../lib/apiClient";

export default function Semester() {
    const router = useRouter();

    const [years, setYears] = useState<string[]>([]);
    const semesters: Record<number, string> = {
        1: "Semester 1",
        2: "Semester 2",
        3: "Summer",
    };

    const [selectedYear, setSelectedYear] = useState<string | null>(null);

    useEffect(() => {
        const currentYear = new Date().getFullYear();
        const nextYears = Array.from({ length: 4 }, (_, i) => (currentYear + i).toString());
        setYears(nextYears);

        // Set default selectedYear to first year
        setSelectedYear(nextYears[0]);
    }, []);

    // Set default selectedSemester to first key
    const [selectedSemester, setSelectedSemester] = useState<number>(Number(Object.keys(semesters)[0]));

    const [ userDegree, setUserDegree ] = useState<string | null>(null);
    const [ degrees, setDegrees ] = useState<Degree[]>([]);

    useEffect(() => {
        const fetchDegrees = async () => {
            try {
                const res = await getAllDegrees();
                console.log("Fetched degrees:", res.data.data);
                setUserDegree(res.data.data[0].id || null); // Set the first degree as default
                setDegrees(res.data.data);
            } catch (error) {
                console.error("Failed to fetch degrees:", error);
            }
        };

        fetchDegrees();
    }, []);

    const submitSelection = () => {
        if (selectedYear && selectedSemester && userDegree) {
            const params = new URLSearchParams({
                    semesterId: selectedSemester.toString(),
                    year: selectedYear,
                    degreeId: userDegree.toString(),
                }).toString();

                router.push(`/semester_courses?${params}`);
        } else {
            console.warn("Please select both year and semester");
        }
    };



    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
        <form className="w-full max-w-md rounded-2xl bg-white shadow-lg p-6 space-y-6" onSubmit={(e) => { e.preventDefault(); submitSelection(); }}>
            <h1 className="text-2xl font-bold text-gray-800 text-center">Plan Your Semester</h1>

            {/* Degree selection */}
            <div>
            <label htmlFor="degree" className="block text-sm font-medium text-gray-700 mb-2">
                Select Degree
            </label>
            <select
                id="degree"
                name="degree"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                onChange={(e) => setUserDegree(e.target.value)}
            >
                {degrees.map((degree) => (
                    <option key={degree.id} value={degree.id}>
                        {degree.title}
                    </option>
                ))}
            </select>
            </div>

            {/* Year selection */}
            <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Select Year
            </label>
            <select
                id="year"
                name="year"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                onChange={(e) => setSelectedYear(e.target.value)}
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
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
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
