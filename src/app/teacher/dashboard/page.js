"use client";

import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [userRes, coursesRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/courses"),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        if (coursesRes.ok) {
          const allCourses = await coursesRes.json();
          // Filter courses taught by this teacher once user data is available
          const userInfo = await (await fetch("/api/auth/me")).json();
          const teacherName = userInfo.user?.name || "";
          const myCourses = allCourses.filter(
            (c) => c.teacher === teacherName
          );
          setCourses(myCourses);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalStudents = courses.reduce((sum, c) => sum + (c.studentsCount || 0), 0);

  // Parse today's lectures from course schedules
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const todayShort = today.slice(0, 3); // Mon, Tue, Wed, etc.
  const todaysLectures = courses.filter((c) => {
    const schedule = c.schedule || "";
    return schedule.includes(todayShort) || schedule.includes(today);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Instructor Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back, {user?.name || "Instructor"}. Here is your teaching overview.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">My Classes</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{courses.length}</p>
          <p className="mt-1 text-xs text-gray-400">Assigned courses</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Students</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{totalStudents}</p>
          <p className="mt-1 text-xs text-gray-400">Across all classes</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Today&apos;s Lectures</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{todaysLectures.length}</p>
          <p className="mt-1 text-xs text-gray-400">{today}</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Today&apos;s Schedule</h2>
        </div>
        {todaysLectures.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            No lectures scheduled for today.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Course</th>
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Room</th>
                <th className="px-6 py-3">Time</th>
                <th className="px-6 py-3">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {todaysLectures.map((course) => {
                // Extract time from schedule string like "Mon, Wed (08:30 AM - 09:45 AM)"
                const timeMatch = course.schedule?.match(/\(([^)]+)\)/);
                const time = timeMatch ? timeMatch[1] : course.schedule;
                return (
                  <tr key={course.code} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium text-gray-900">{course.name}</td>
                    <td className="px-6 py-3 text-gray-500">{course.code}</td>
                    <td className="px-6 py-3 text-gray-500">{course.room}</td>
                    <td className="px-6 py-3 text-gray-500">{time}</td>
                    <td className="px-6 py-3 text-gray-500">{course.studentsCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* All Assigned Courses */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">All Assigned Courses</h2>
        </div>
        {courses.length === 0 ? (
          <div className="px-6 py-10 text-center text-sm text-gray-400">
            No courses assigned.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3">Code</th>
                <th className="px-6 py-3">Course Name</th>
                <th className="px-6 py-3">Schedule</th>
                <th className="px-6 py-3">Room</th>
                <th className="px-6 py-3">Students</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map((c) => (
                <tr key={c.code} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs text-gray-600">{c.code}</td>
                  <td className="px-6 py-3 font-medium text-gray-900">{c.name}</td>
                  <td className="px-6 py-3 text-gray-500">{c.schedule}</td>
                  <td className="px-6 py-3 text-gray-500">{c.room}</td>
                  <td className="px-6 py-3 text-gray-500">{c.studentsCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
