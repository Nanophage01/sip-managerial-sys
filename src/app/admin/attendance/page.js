"use client";

import { useState } from "react";

export default function AdminAttendance() {
  const coursesList = [
    { code: "MATH-304", name: "Advanced Mathematics", time: "08:30 AM", attendance: "95%" },
    { code: "CHEM-202", name: "Chemistry & Lab", time: "10:00 AM", attendance: "94%" },
    { code: "ENGL-102", name: "English Literature", time: "11:30 AM", attendance: "96%" },
    { code: "HIST-205", name: "World History", time: "01:45 PM", attendance: "92%" },
    { code: "PHYS-301", name: "Introductory Physics", time: "09:00 AM", attendance: "97%" },
    { code: "COMP-101", name: "Computer Science I", time: "01:00 PM", attendance: "98%" },
  ];

  const mockStudents = [
    { id: "ST-202601", name: "Bobby Tables", status: "Present" },
    { id: "ST-202602", name: "Alice Cooper", status: "Present" },
    { id: "ST-202604", name: "Jane Doe", status: "Present" },
    { id: "ST-202605", name: "John Smith", status: "Late" },
    { id: "ST-202607", name: "Ada Lovelace", status: "Absent" },
  ];

  const [selectedCourse, setSelectedCourse] = useState("");
  const [studentsAttendance, setStudentsAttendance] = useState(mockStudents);
  const [successMsg, setSuccessMsg] = useState("");

  const handleOpenAttendanceSheet = (code) => {
    setSelectedCourse(code);
    setStudentsAttendance(
      mockStudents.map((s) => ({
        ...s,
        // randomize some default selections just to make it dynamic
        status: Math.random() > 0.8 ? "Absent" : Math.random() > 0.85 ? "Late" : "Present",
      }))
    );
    setSuccessMsg("");
  };

  const handleStatusChange = (id, newStatus) => {
    setStudentsAttendance(
      studentsAttendance.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleSaveAttendance = (e) => {
    e.preventDefault();
    setSuccessMsg(`Daily attendance sheet for ${selectedCourse} has been saved successfully!`);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Manager</h1>
        <p className="text-sm text-gray-500">Track general course compliance or record the roll-call logs for today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Attendance Dashboard List */}
        <div className="md:col-span-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden h-fit">
          <div className="border-b border-gray-200 px-5 py-4 bg-gray-50">
            <h2 className="font-semibold text-gray-900 text-xs uppercase tracking-wider text-gray-500">Today's Class Registers</h2>
          </div>
          <div className="divide-y divide-gray-100 p-2">
            {coursesList.map((c) => (
              <button
                key={c.code}
                onClick={() => handleOpenAttendanceSheet(c.code)}
                className={`w-full text-left p-3 rounded transition-colors flex justify-between items-center text-xs ${
                  selectedCourse === c.code ? "bg-blue-50/50 border border-blue-200" : "hover:bg-gray-50"
                }`}
              >
                <div>
                  <span className="font-bold text-gray-900 block">{c.code}</span>
                  <span className="text-gray-400 mt-0.5 block">{c.time}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-primary block">{c.attendance}</span>
                  <span className="text-[10px] text-gray-500 mt-0.5 block">Record Daily</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Attendance Sheet */}
        <div className="md:col-span-2 space-y-4">
          {selectedCourse ? (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <span className="text-[9px] font-bold text-primary bg-blue-50 border border-blue-200 px-2 py-0.5 rounded mr-2">
                    {selectedCourse}
                  </span>
                  <h2 className="text-md font-bold text-gray-900 inline-block">Daily Attendance Sheet</h2>
                </div>
                <span className="text-xs text-gray-400 font-medium">Date: {new Date().toLocaleDateString()}</span>
              </div>

              <form onSubmit={handleSaveAttendance} className="p-6">
                {successMsg && (
                  <div className="mb-4 p-3 text-xs text-green-700 bg-green-50 border border-green-200 rounded">
                    {successMsg}
                  </div>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse mb-6">
                    <thead>
                      <tr className="border-b border-gray-200 text-gray-500 font-semibold bg-gray-50/50">
                        <th className="px-4 py-3">Student ID</th>
                        <th className="px-4 py-3">Student Name</th>
                        <th className="px-4 py-3 text-right">Attendance Roll</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {studentsAttendance.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50/10">
                          <td className="px-4 py-3 font-bold text-gray-900">{student.id}</td>
                          <td className="px-4 py-3 font-medium text-gray-800">{student.name}</td>
                          <td className="px-4 py-3 text-right">
                            <div className="inline-flex rounded-md border border-gray-200 p-0.5 bg-gray-50">
                              {["Present", "Absent", "Late"].map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleStatusChange(student.id, opt)}
                                  className={`px-3 py-1 rounded text-[10px] font-semibold transition-colors ${
                                    student.status === opt
                                      ? opt === "Present"
                                        ? "bg-green-600 text-white shadow-sm"
                                        : opt === "Absent"
                                        ? "bg-red-600 text-white shadow-sm"
                                        : "bg-yellow-500 text-white shadow-sm"
                                      : "text-gray-600 hover:text-gray-900"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4">
                  <button
                    type="submit"
                    className="rounded bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-light transition-colors"
                  >
                    Save Attendance Log
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 border-dashed rounded-lg p-12 text-center text-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="font-semibold text-gray-600 text-sm">No Class Selected</h3>
              <p className="text-xs text-gray-500 mt-1">Select a class register from the left panel to record or view attendance logs.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
