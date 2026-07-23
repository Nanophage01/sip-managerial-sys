"use client";

import { useEffect, useState } from "react";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({ code: "", name: "", teacher: "", room: "", schedule: "", studentsCount: 0 });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setIsLoading(true);
      const resCourses = await fetch("/api/courses");
      const coursesData = await resCourses.json();
      setCourses(coursesData || []);

      const resTeachers = await fetch("/api/teachers");
      const teachersData = await resTeachers.json();
      setTeachers(teachersData || []);
    } catch (err) {
      console.error("Failed to fetch courses/teachers:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenAdd = () => {
    const defaultTeacher = teachers.length > 0 ? teachers[0].name : "Dr. Elizabeth Vance";
    setCurrentCourse({ code: "", name: "", teacher: defaultTeacher, room: "", schedule: "", studentsCount: 0 });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!currentCourse.code || !currentCourse.name || !currentCourse.room || !currentCourse.schedule) {
      setFormError("All fields are required.");
      return;
    }

    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentCourse),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        setFormError(err.error || "Failed to create course.");
      }
    } catch (err) {
      console.error("Create course failed:", err);
      setFormError("Failed to create course due to network error.");
    }
  };

  const handleDelete = async (code) => {
    if (confirm(`Are you sure you want to remove the course ${code}?`)) {
      try {
        const res = await fetch(`/api/courses/${code}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchData();
        } else {
          const err = await res.json();
          alert(`Remove failed: ${err.error}`);
        }
      } catch (err) {
        console.error("Failed to remove course:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses & Classes</h1>
          <p className="text-sm text-gray-500">Configure academic subjects, assign rooms, and set lecture timetables.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors w-fit"
        >
          Create New Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-gray-400 font-medium">
            Loading course catalogue...
          </div>
        ) : courses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400 font-medium">
            No active courses found. Click "Create New Course" to add one.
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.code} className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between overflow-hidden">
              <div className="p-5">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[9px] font-bold text-primary bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                      {course.code}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 mt-2">{course.name}</h3>
                  </div>
                  <button
                    onClick={() => handleDelete(course.code)}
                    className="text-red-500 hover:text-red-700 font-medium text-xs"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 space-y-2 text-xs border-t border-gray-100 pt-3 text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Instructor:</span>
                    <span className="text-gray-900">{course.teacher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Schedule:</span>
                    <span className="text-gray-900">{course.schedule}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Room:</span>
                    <span className="text-gray-900">{course.room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-500">Enrollment:</span>
                    <span className="font-semibold text-gray-900">{course.studentsCount || 20} Students</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border-t border-gray-100 px-5 py-2.5 flex justify-end gap-3 text-xs">
                <a href="#" className="text-primary hover:text-primary-light font-semibold">
                  Class Roster
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900">Create Academic Course</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {formError && (
                <div className="p-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code</label>
                  <input
                    type="text"
                    value={currentCourse.code}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, code: e.target.value })}
                    placeholder="MATH-304"
                    className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none uppercase"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Course Name</label>
                  <input
                    type="text"
                    value={currentCourse.name}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, name: e.target.value })}
                    placeholder="Advanced Calculus"
                    className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Teacher</label>
                <select
                  value={currentCourse.teacher}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, teacher: e.target.value })}
                  className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none bg-white"
                >
                  {teachers.length > 0 ? (
                    teachers.map((t) => (
                      <option key={t.teacherId} value={t.name}>
                        {t.name} ({t.department})
                      </option>
                    ))
                  ) : (
                    <option value="Dr. Elizabeth Vance">Dr. Elizabeth Vance</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Room Location</label>
                  <input
                    type="text"
                    value={currentCourse.room}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, room: e.target.value })}
                    placeholder="e.g. Room 304 or Lab A"
                    className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Timing / Days</label>
                  <input
                    type="text"
                    value={currentCourse.schedule}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, schedule: e.target.value })}
                    placeholder="Mon, Wed (08:30 AM - 09:45 AM)"
                    className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-light transition-colors font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
