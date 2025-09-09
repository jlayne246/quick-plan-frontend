"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from "react"

import { getCoursesBySemester, getDegreeById, getAllFaculties } from "../lib/apiClient";

import { CourseOffering, Degree, Faculty } from "../lib/types";
import { get } from 'http';

export default function SemesterCourses() {

    const searchParams = useSearchParams();
    const semesterId = Number(searchParams?.get('semesterId') ?? 0);
    const degreeId = Number(searchParams?.get('degreeId') ?? 0);
    const year = searchParams?.get('year') ?? '';

    const [courses, setCourses] = useState<CourseOffering[]>([]);
    const [degreeCourses, setDegreeCourses] = useState<CourseOffering[]>([]);
    const [mandatoryCourses, setMandatoryCourses] = useState<CourseOffering[]>([]);
    const [foundationCourses, setFoundationCourses] = useState<CourseOffering[]>([]);
    const [facultyCourses, setFacultyCourses] = useState<CourseOffering[]>([]);
    const [otherCourses, setOtherCourses] = useState<CourseOffering[]>([]);
    const [userDegree, setUserDegree] = useState<Degree | null>(null);
    const [userFaculty, setUserFaculty] = useState<Faculty | null>(null);

    const [faculties, setFaculties] = useState<Faculty[] | null>(null);

    useEffect(() => {
        // Fetch all faculties once
        const fetchFaculties = async () => {
            try {
                const faculties = await getAllFaculties();
                setFaculties(faculties.data); // assuming the API returns { data: [...] }
            } catch (error) {
                console.error("Failed to fetch faculties:", error);
            }
        };

        fetchFaculties();
    }, [])

    useEffect(() => {
        if (degreeId) {
            // Fetch degree details if needed
            getDegreeById(degreeId)
                .then((res) => {
                    setUserDegree(res.data);

                    if (res.data.major && faculties) {
                    // Find the faculty containing this major in its programmes array
                    const matchingFaculty = faculties.find(f =>
                        f.programmes.some(p => p === res.data.major)
                    );

                    if (matchingFaculty) {
                        setUserFaculty(matchingFaculty);
                    }
                }
                })
                .catch(console.error);
        }
    }, [degreeId, faculties]);

    useEffect(() => {
        if (!semesterId || !userDegree || !userFaculty) return;

        if (semesterId) {
            getCoursesBySemester(semesterId)
                .then((res) => {
                    //setCourses(res.data); // only the data array
                    if (degreeId) {
                        const allCourses: CourseOffering[] = res.data;

                        if (!degreeId) {
                            setCourses(allCourses);
                            return;
                        }

                        const mandatoryCourses = allCourses.filter((course: CourseOffering) =>
                            course.course?.mandatory_for_degrees?.includes(degreeId)
                        );

                        const degreeCourses = allCourses.filter(course =>
                            (userDegree?.major === (course.course?.programme_code) ||
                            userDegree?.minor?.includes(course.course?.programme_code)) &&
                            !mandatoryCourses.some(c => c.course?.course_code === course.course?.course_code)
                        );

                        const facultyCourses = allCourses.filter(course =>
                            userFaculty?.programmes?.includes(course.course?.programme_code) &&
                            !degreeCourses.some(c => c.course?.course_code === course?.course.course_code) &&
                            !mandatoryCourses.some(c => c.course?.course_code === course.course?.course_code)
                        );

                        const foundationCourses = allCourses.filter(course =>
                            course.course?.programme_code === "FOUN"
                        );

                        const otherCourses = allCourses.filter(course =>
                            !userFaculty?.programmes?.includes(course.course?.programme_code) &&
                            !degreeCourses.some(c => c.course?.course_code === course.course?.course_code) &&
                            !mandatoryCourses.some(c => c.course?.course_code === course.course?.course_code) &&
                            !foundationCourses.some(c => c.course?.course_code === course.course?.course_code)
                        );

                        setMandatoryCourses(mandatoryCourses);
                        setDegreeCourses(degreeCourses);
                        setFacultyCourses(facultyCourses);
                        setFoundationCourses(foundationCourses);
                        setOtherCourses(otherCourses);
                        setCourses(allCourses);
                    }
                })
                .catch(console.error);
        }
    }, [semesterId, degreeId, userDegree, userFaculty]);

    //console.log(courses, mandatoryCourses, degreeCourses, facultyCourses, otherCourses);
    //console.log(userDegree, userFaculty);

    return (
        <div className="flex-col min-h-screen items-center justify-center bg-gray-100 p-6">
            <h1 className="text-2xl font-bold text-gray-800 text-center">Courses offered in Semester {semesterId} {year}</h1>
            <h2 className="text-lg font-semibold text-gray-700 text-center"> Within Degree</h2>
            <h3 className='text-md font-medium text-gray-600 text-center m-2'>Mandatory</h3>
            <ul className="mt-4 space-y-2">
                {mandatoryCourses && mandatoryCourses.length > 0 ? (
                    mandatoryCourses.map((course) => (
                        <li key={course.id} className="p-4 bg-white rounded-lg shadow">
                            <h2 className="text-lg font-semibold">{course.course.course_name}</h2>
                            <p className="text-gray-600">{course.course.course_code}</p>
                            <p className="text-gray-600">Credits: {course.course.credits}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">No mandatory courses available.</p>
                )}

            </ul>

            <h4 className="text-md font-italic text-gray-700 text-center m-2">Foundation</h4>
            <ul className="mt-4 space-y-2">
                {foundationCourses && foundationCourses.length > 0 ? (
                    foundationCourses.map((course) => (
                        <li key={course.id} className="p-4 bg-white rounded-lg shadow">
                            <h2 className="text-lg font-semibold">{course.course.course_name}</h2>
                            <p className="text-gray-600">{course.course.course_code}</p>
                            <p className="text-gray-600">Credits: {course.course.credits}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">No foundation courses available.</p>
                )}
            </ul>

            {/* Within Degree */}
            <h3 className="text-md font-medium text-gray-600 text-center m-2">Within Degree</h3>
            <ul className="mt-4 space-y-2">
                {degreeCourses && degreeCourses.length > 0 ? (
                    degreeCourses.map((course) => (
                        <li key={course.id} className="p-4 bg-white rounded-lg shadow">
                            <h2 className="text-lg font-semibold">{course.course.course_name}</h2>
                            <p className="text-gray-600">{course.course.course_code}</p>
                            <p className="text-gray-600">Credits: {course.course.credits}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">No courses within your degree.</p>
                )}
            </ul>

            {/* Within Faculty */}
            <h3 className="text-md font-medium text-gray-600 text-center m-2">Within Faculty</h3>
            <ul className="mt-4 space-y-2">
                {facultyCourses && facultyCourses.length > 0 ? (
                    facultyCourses.map((course) => (
                        <li key={course.id} className="p-4 bg-white rounded-lg shadow">
                            <h2 className="text-lg font-semibold">{course.course.course_name}</h2>
                            <p className="text-gray-600">{course.course.course_code}</p>
                            <p className="text-gray-600">Credits: {course.course.credits}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">No courses within your faculty.</p>
                )}
            </ul>

            {/* Out of Faculty */}
            <h3 className="text-md font-medium text-gray-600 text-center m-2">Out of Faculty</h3>
            <ul className="mt-4 space-y-2">
                {otherCourses && otherCourses.length > 0 ? (
                    otherCourses.map((course) => (
                        <li key={course.id} className="p-4 bg-white rounded-lg shadow">
                            <h2 className="text-lg font-semibold">{course.course.course_name}</h2>
                            <p className="text-gray-600">{course.course.course_code}</p>
                            <p className="text-gray-600">Credits: {course.course.credits}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-center text-gray-500 italic">No courses outside of your faculty.</p>
                )}
            </ul>

        </div>
    );
}
