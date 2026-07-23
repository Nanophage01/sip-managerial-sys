"use client";

import { useEffect, useState } from "react";

export default function TeacherGradebook() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // New assessment form
  const [showForm, setShowForm] = useState(false);
  const [targetStudentId, setTargetStudentId] = useState("");
  const [assessmentName, setAssessmentName] = useState("");
  const [assessmentType, setAssessmentType] = useState("Homework");
  const [assessmentWeight, setAssessmentWeight] = useState("");
  const [assessmentScore, setAssessmentScore] = useState("");

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
          const myCourses = allCourses.filter((c) => c.teacher === teacherName);
          setCourses(myCourses);
          if (myCourses.length > 0) {
            setSelectedCourse(myCourses[0].code);
          }
        }

        if (studentsRes.ok) {
          const allStudents = await studentsRes.json();
          setStudents(allStudents.filter((s) => s.status === "Enrolled"));
        }
      } catch (err) {
        console.error("Failed to load gradebook data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Fetch grades when course changes
  useEffect(() => {
    if (!selectedCourse) return;

    async function fetchGrades() {
      try {
        const res = await fetch("/api/grades");
        if (res.ok) {
          const allGrades = await res.json();
          const courseGrades = allGrades.filter(
            (g) => g.courseCode === selectedCourse
          );
          setGrades(courseGrades);
        }
      } catch (err) {
        console.error("Failed to load grades:", err);
      }
    }
    fetchGrades();
  }, [selectedCourse]);

  const getStudentGrade = (studentId) => {
    return grades.find((g) => g.studentId === studentId);
  };

  const selectedCourseName =
    courses.find((c) => c.code === selectedCourse)?.name || "";

  const handleAddAssessment = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/grades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: targetStudentId,
          courseCode: selectedCourse,
          courseName: selectedCourseName,
          assessment: {
            name: assessmentName,
            type: assessmentType,
            weight: assessmentWeight,
            score: assessmentScore,
          },
        }),
      });

      if (res.ok) {
        setMessage("Assessment saved successfully.");
        setShowForm(false);
        setAssessmentName("");
        setAssessmentType("Homework");
        setAssessmentWeight("");
        setAssessmentScore("");
        setTargetStudentId("");

        // Refresh grades
        const gradesRes = await fetch("/api/grades");
        if (gradesRes.ok) {
          const allGrades = await gradesRes.json();
          setGrades(allGrades.filter((g) => g.courseCode === selectedCourse));
        }
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to save assessment.");
      }
    } catch (err) {
      console.error("Save error:", err);
      setMessage("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Loading gradebook...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gradebook</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage student grades for your courses.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
        >
          {showForm ? "Cancel" : "+ Add Assessment"}
        </button>
      </div>

      {/* Course Selector */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Select Course
        </label>
        <select
          value={selectedCourse}
          onChange={(e) => {
            setSelectedCourse(e.target.value);
            setMessage("");
          }}
          className="block w-full max-w-md rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {courses.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Assessment Form */}
      {showForm && (
        <form
          onSubmit={handleAddAssessment}
          className="bg-white border border-gray-200 rounded-xl p-6 space-y-4"
        >
          <h3 className="text-sm font-semibold text-gray-800">
            Add Assessment — {selectedCourse}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Student
              </label>
              <select
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s.studentId} value={s.studentId}>
                    {s.name} ({s.studentId})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Assessment Name
              </label>
              <input
                type="text"
                value={assessmentName}
                onChange={(e) => setAssessmentName(e.target.value)}
                placeholder="e.g. Midterm Exam"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Type
              </label>
              <select
                value={assessmentType}
                onChange={(e) => setAssessmentType(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Homework">Homework</option>
                <option value="Quiz">Quiz</option>
                <option value="Exam">Exam</option>
                <option value="Lab">Lab</option>
                <option value="Project">Project</option>
                <option value="Essay">Essay</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Weight
              </label>
              <input
                type="text"
                value={assessmentWeight}
                onChange={(e) => setAssessmentWeight(e.target.value)}
                placeholder="e.g. 25%"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Score
              </label>
              <input
                type="text"
                value={assessmentScore}
                onChange={(e) => setAssessmentScore(e.target.value)}
                placeholder="e.g. 88/100"
                required
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Assessment"}
            </button>
            {message && (
              <p
                className={`text-sm ${
                  message.includes("success")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {message}
              </p>
            )}
          </div>
        </form>
      )}

      {/* Student Grades Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            Student Grades — {selectedCourseName}
          </h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-3">Student ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Assessments</th>
              <th className="px-6 py-3">Final Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((s) => {
              const gradeRecord = getStudentGrade(s.studentId);
              return (
                <tr key={s.studentId} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono text-xs text-gray-500">
                    {s.studentId}
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-900">
                    {s.name}
                  </td>
                  <td className="px-6 py-3 text-gray-500">
                    {gradeRecord && gradeRecord.assessments ? (
                      <div className="space-y-0.5">
                        {gradeRecord.assessments.map((a, i) => (
                          <div key={i} className="text-xs">
                            <span className="text-gray-700 font-medium">
                              {a.name}
                            </span>{" "}
                            — {a.score}{" "}
                            <span className="text-gray-400">({a.weight})</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-300">
                        No assessments
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {gradeRecord ? (
                      <span className="font-semibold text-gray-900">
                        {gradeRecord.finalGrade}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-300">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {message && !showForm && (
        <p
          className={`text-sm ${
            message.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
