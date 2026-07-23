"use client";

import { useEffect, useState } from "react";

export default function TeacherAttendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function fetchCourses() {
      try {
        const [userRes, coursesRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/courses"),
        ]);

        if (userRes.ok && coursesRes.ok) {
          const userData = await userRes.json();
          const allCourses = await coursesRes.json();
          const teacherName = userData.user?.name || "";
          const myCourses = allCourses.filter(
            (c) => c.teacher === teacherName
          );
          setCourses(myCourses);
          if (myCourses.length > 0) {
            setSelectedCourse(myCourses[0].code);
          }
        }
      } catch (err) {
        console.error("Failed to load courses:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) return;

    async function fetchAttendance() {
      try {
        const res = await fetch(
          `/api/attendance?courseCode=${selectedCourse}&date=${date}`
        );
        if (res.ok) {
          const data = await res.json();
          setRecords(data.records || []);
        }
      } catch (err) {
        console.error("Failed to load attendance:", err);
      }
    }
    fetchAttendance();
  }, [selectedCourse, date]);

  const updateStatus = (studentId, status) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, status } : r))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseCode: selectedCourse,
          date,
          records,
        }),
      });

      if (res.ok) {
        setMessage("Attendance saved successfully.");
      } else {
        setMessage("Failed to save attendance.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = records.filter((r) => r.status === "Present").length;
  const absentCount = records.filter((r) => r.status === "Absent").length;
  const lateCount = records.filter((r) => r.status === "Late").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading attendance...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Register</h1>
        <p className="mt-1 text-sm text-gray-500">
          Record daily student attendance for your classes.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Select Class
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {courses.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="block rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-center">
          <p className="text-xl font-bold text-green-700">{presentCount}</p>
          <p className="text-xs text-green-600">Present</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-center">
          <p className="text-xl font-bold text-red-700">{absentCount}</p>
          <p className="text-xs text-red-600">Absent</p>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-center">
          <p className="text-xl font-bold text-yellow-700">{lateCount}</p>
          <p className="text-xs text-yellow-600">Late</p>
        </div>
      </div>

      {/* Roll Call Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Student ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {records.map((record) => (
              <tr key={record.studentId} className="hover:bg-gray-50">
                <td className="px-6 py-3 font-mono text-xs text-gray-500">
                  {record.studentId}
                </td>
                <td className="px-6 py-3 font-medium text-gray-900">
                  {record.name}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-1">
                    {["Present", "Absent", "Late"].map((status) => (
                      <button
                        key={status}
                        onClick={() =>
                          updateStatus(record.studentId, status)
                        }
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                          record.status === status
                            ? status === "Present"
                              ? "bg-green-600 text-white"
                              : status === "Absent"
                              ? "bg-red-600 text-white"
                              : "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving || records.length === 0}
          className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Attendance"}
        </button>
        {message && (
          <p className={`text-sm ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
