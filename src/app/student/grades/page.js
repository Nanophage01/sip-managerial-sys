"use client";

import { useEffect, useState } from "react";

export default function StudentGrades() {
  const [coursesGrades, setCoursesGrades] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGrades() {
      try {
        const res = await fetch("/api/grades?studentId=ST-202604");
        const data = await res.json();
        setCoursesGrades(data);
      } catch (err) {
        console.error("Failed to fetch grades:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGrades();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-gray-500">
        Loading grades report...
      </div>
    );
  }

  const filteredCourses =
    selectedCourse === "all"
      ? coursesGrades
      : coursesGrades.filter((c) => c.courseCode === selectedCourse);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades & Transcripts</h1>
          <p className="text-sm text-gray-500">Track your assignment scores, test results, and final grading points.</p>
        </div>

        {/* Filter Dropdown */}
        <div>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary bg-white"
          >
            <option value="all">All Enrolled Courses</option>
            {coursesGrades.map((c) => (
              <option key={c.courseCode} value={c.courseCode}>
                {c.courseName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Loop */}
      <div className="space-y-6">
        {filteredCourses.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400">
            No grades data found in database.
          </div>
        ) : (
          filteredCourses.map((course) => (
            <div key={course.courseCode} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
              {/* Header info */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-primary bg-blue-50 border border-blue-200 px-2 py-0.5 rounded mr-2">
                    {course.courseCode}
                  </span>
                  <h2 className="text-md font-bold text-gray-900 inline-block mt-1 sm:mt-0">{course.courseName}</h2>
                </div>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 font-medium block">GPA Weight</span>
                    <span className="font-bold text-gray-900">{course.gpaPoints} / 4.0</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500 font-medium block">Current Standing</span>
                    <span className="font-extrabold text-primary">{course.finalGrade}</span>
                  </div>
                </div>
              </div>

              {/* Assessment Detail Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                      <th className="px-6 py-3">Assessment Name</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Weight</th>
                      <th className="px-6 py-3 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {course.assessments.map((ass, i) => (
                      <tr key={i} className="hover:bg-gray-50/20">
                        <td className="px-6 py-4 font-medium text-gray-900">{ass.name}</td>
                        <td className="px-6 py-4">
                          <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded border border-gray-200">
                            {ass.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">{ass.weight}</td>
                        <td className="px-6 py-4 text-right font-bold text-gray-900">{ass.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
