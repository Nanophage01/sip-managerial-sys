"use client";

import { useState } from "react";

export default function StudentCourses() {
  const courses = [
    {
      code: "MATH-304",
      name: "Advanced Mathematics",
      teacher: "Dr. Elizabeth Vance",
      room: "Room 304",
      schedule: "Mon, Wed (08:30 AM - 09:45 AM)",
      grade: "91% (A-)",
      attendance: "98%",
      syllabus: "Functions, Derivatives, Integrals, and Vector Math fundamentals.",
    },
    {
      code: "CHEM-202",
      name: "Chemistry & Lab",
      teacher: "Mr. Arthur Pendelton",
      room: "Lab B",
      schedule: "Mon, Wed (10:00 AM - 11:15 AM)",
      grade: "94% (A)",
      attendance: "95%",
      syllabus: "Chemical bonding, thermodynamics, reactions kinetics, and weekly lab experiments.",
    },
    {
      code: "ENGL-102",
      name: "English Literature",
      teacher: "Ms. Sarah Jenkins",
      room: "Room 102",
      schedule: "Tue, Thu (11:30 AM - 12:45 PM)",
      grade: "88% (B+)",
      attendance: "94%",
      syllabus: "Analyzing classical novels, modern essays, and writing critical reviews.",
    },
    {
      code: "HIST-205",
      name: "World History",
      teacher: "Mr. Gregory House",
      room: "Room 205",
      schedule: "Tue, Thu (01:45 PM - 03:00 PM)",
      grade: "92% (A-)",
      attendance: "97%",
      syllabus: "A global exploration of historical developments, wars, trade routes, and cultures.",
    },
    {
      code: "PHYS-301",
      name: "Introductory Physics",
      teacher: "Dr. Gordon Freeman",
      room: "Lab C",
      schedule: "Friday (09:00 AM - 12:00 PM)",
      grade: "85% (B)",
      attendance: "92%",
      syllabus: "Newtonian mechanics, momentum, energy conservation, wave theory, and basic thermodynamics.",
    },
    {
      code: "COMP-101",
      name: "Computer Science I",
      teacher: "Dr. Alan Turing",
      room: "Computer Lab 1",
      schedule: "Friday (01:00 PM - 04:00 PM)",
      grade: "97% (A+)",
      attendance: "100%",
      syllabus: "Introduction to programming concepts, variables, control structures, and object-oriented design.",
    },
  ];

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
                  <p className="text-lg font-extrabold text-primary">{course.grade}</p>
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
                  <span>{course.attendance}</span>
                </div>
              </div>

              <div className="mt-4 bg-gray-50 rounded p-3 text-xs text-gray-600 border border-gray-100">
                <span className="font-semibold block text-[10px] uppercase text-gray-500 tracking-wider mb-1">Course Overview</span>
                {course.syllabus}
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
