"use client";

import { useState } from "react";

export default function AdminCourses() {
  // Mock course data
  const [courses, setCourses] = useState([
    { code: "MATH-304", name: "Advanced Mathematics", teacher: "Dr. Elizabeth Vance", room: "Room 304", schedule: "Mon, Wed (08:30 AM - 09:45 AM)", studentsCount: 24 },
    { code: "CHEM-202", name: "Chemistry & Lab", teacher: "Mr. Arthur Pendelton", room: "Lab B", schedule: "Mon, Wed (10:00 AM - 11:15 AM)", studentsCount: 18 },
    { code: "ENGL-102", name: "English Literature", teacher: "Ms. Sarah Jenkins", room: "Room 102", schedule: "Tue, Thu (11:30 AM - 12:45 PM)", studentsCount: 30 },
    { code: "HIST-205", name: "World History", teacher: "Mr. Gregory House", room: "Room 205", schedule: "Tue, Thu (01:45 PM - 03:00 PM)", studentsCount: 22 },
    { code: "PHYS-301", name: "Introductory Physics", teacher: "Dr. Gordon Freeman", room: "Lab C", schedule: "Friday (09:00 AM - 12:00 PM)", studentsCount: 15 },
    { code: "COMP-101", name: "Computer Science I", teacher: "Dr. Alan Turing", room: "Computer Lab 1", schedule: "Friday (01:00 PM - 04:00 PM)", studentsCount: 28 },
  ]);

  // List of teachers for assignment dropdown
  const teachersList = [
    "Dr. Elizabeth Vance",
    "Mr. Arthur Pendelton",
    "Ms. Sarah Jenkins",
    "Mr. Gregory House",
    "Dr. Gordon Freeman",
    "Dr. Alan Turing",
    "Dr. Jane Foster",
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState({ code: "", name: "", teacher: teachersList[0], room: "", schedule: "", studentsCount: 0 });
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setCurrentCourse({ code: "", name: "", teacher: teachersList[0], room: "", schedule: "", studentsCount: 0 });
    setFormError("");
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError("");

    if (!currentCourse.code || !currentCourse.name || !currentCourse.room || !currentCourse.schedule) {
      setFormError("All fields are required.");
      return;
    }

    // Check if course code already exists
    if (courses.some((c) => c.code.toUpperCase() === currentCourse.code.toUpperCase())) {
      setFormError("Course code already exists.");
      return;
    }

    setCourses([...courses, { ...currentCourse, code: currentCourse.code.toUpperCase() }]);
    setIsModalOpen(false);
  };

  const handleDelete = (code) => {
    if (confirm(`Are you sure you want to remove the course ${code}?`)) {
      setCourses(courses.filter((c) => c.code !== code));
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
        {courses.map((course) => (
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
                  <span className="font-semibold text-gray-900">{course.studentsCount} Students</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 px-5 py-2.5 flex justify-end gap-3 text-xs">
              <a href="#" className="text-primary hover:text-primary-light font-semibold">
                Class Roster
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
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
                  {teachersList.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
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
