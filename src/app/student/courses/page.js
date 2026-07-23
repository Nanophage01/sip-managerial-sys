"use client";

import { useEffect, useState } from "react";

export default function StudentCourses() {
  const [courses, setCourses] = useState([]);
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const resCourses = await fetch("/api/courses");
        const coursesData = await resCourses.json();
        setCourses(coursesData);

        const resGrades = await fetch("/api/grades?studentId=ST-202604");
        const gradesData = await resGrades.json();
        setGrades(gradesData);
      } catch (err) {
        console.error("Failed to fetch courses data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-gray-500">
        Loading courses...
      </div>
    );
  }

  // Helper to map course grades dynamically
  const getCourseStanding = (courseCode) => {
    const courseGrade = grades.find((g) => g.courseCode === courseCode);
    return courseGrade ? courseGrade.finalGrade : "N/A";
  };

  const getSyllabus = (code) => {
    const syllabi = {
      "MATH-304": "Functions, Derivatives, Integrals, and Vector Math fundamentals.",
      "CHEM-202": "Chemical bonding, thermodynamics, reactions kinetics, and weekly lab experiments.",
      "ENGL-102": "Analyzing classical novels, modern essays, and writing critical reviews.",
      "HIST-205": "A global exploration of historical developments, wars, trade routes, and cultures.",
      "PHYS-301": "Newtonian mechanics, momentum, energy conservation, wave theory, and basic thermodynamics.",
      "COMP-101": "Introduction to programming concepts, variables, control structures, and object-oriented design.",
    };
    return syllabi[code] || "Syllabus overview and curriculum guidelines for active term.";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enrolled Courses</h1>
        <p className="text-sm text-gray-500">View details, syllabi, instructors, and academic standing for your active subjects.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {courses.map((course) => (
          <div key={course.code} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col justify-between">
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block text-[10px] font-bold text-primary bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {course.code}
                  </span>
                  <h2 className="text-lg font-bold text-gray-900 mt-2">{course.name}</h2>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-gray-500">Grade</span>
                  <p className="text-lg font-extrabold text-primary">{getCourseStanding(course.code)}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span className="font-semibold">Instructor:</span>
                  <span>{course.teacher}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Schedule:</span>
                  <span>{course.schedule}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Location:</span>
                  <span>{course.room}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold">Attendance:</span>
                  <span>95%</span>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded p-3 text-xs text-gray-600 border border-gray-100">
                <span className="font-semibold block text-[10px] uppercase text-gray-500 tracking-wider mb-1">Course Overview</span>
                {getSyllabus(course.code)}
              </div>
            </div>

            <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex gap-4">
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary-light transition-colors">
                View Assignments
              </a>
              <a href="#" className="text-xs font-semibold text-primary hover:text-primary-light transition-colors">
                Download Resources
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
