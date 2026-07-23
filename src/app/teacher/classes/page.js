"use client";

import { useEffect, useState } from "react";

export default function TeacherClasses() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, coursesRes, studentsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/courses"),
          fetch("/api/students"),
        ]);

        if (userRes.ok && coursesRes.ok) {
          const userData = await userRes.json();
          const allCourses = await coursesRes.json();
          const teacherName = userData.user?.name || "";
          const myCourses = allCourses.filter(
            (c) => c.teacher === teacherName
          );
          setCourses(myCourses);
        }

        if (studentsRes.ok) {
          const allStudents = await studentsRes.json();
          setStudents(allStudents.filter((s) => s.status === "Enrolled"));
        }
      } catch (err) {
        console.error("Failed to load classes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading classes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
        <p className="mt-1 text-sm text-gray-500">
          View your assigned courses and enrolled student rosters.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-16 text-center">
          <p className="text-sm text-gray-400">No courses assigned to you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div
              key={course.code}
              className={`bg-white border rounded-xl p-5 cursor-pointer transition-colors ${
                selectedCourse?.code === course.code
                  ? "border-primary ring-1 ring-primary"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() =>
                setSelectedCourse(
                  selectedCourse?.code === course.code ? null : course
                )
              }
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-400">{course.code}</p>
                  <h3 className="mt-1 text-base font-semibold text-gray-900">
                    {course.name}
                  </h3>
                </div>
                <span className="inline-flex items-center text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {course.studentsCount} students
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-500">
                <p>
                  <span className="font-medium text-gray-600">Room:</span>{" "}
                  {course.room}
                </p>
                <p>
                  <span className="font-medium text-gray-600">Schedule:</span>{" "}
                  {course.schedule}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Student Roster */}
      {selectedCourse && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-base font-semibold text-gray-900">
              Enrolled Students — {selectedCourse.name}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Showing all enrolled students. Roster is shared across classes.
            </p>
          </div>
          {students.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-gray-400">
              No enrolled students found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s) => (
                  <tr key={s.studentId} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-mono text-xs text-gray-500">
                      {s.studentId}
                    </td>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      {s.name}
                    </td>
                    <td className="px-6 py-3 text-gray-500">{s.email}</td>
                    <td className="px-6 py-3 text-gray-500">{s.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
