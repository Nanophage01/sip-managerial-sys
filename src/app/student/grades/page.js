"use client";

import { useState } from "react";

export default function StudentGrades() {
  const [selectedCourse, setSelectedCourse] = useState("all");

  const coursesGrades = [
    {
      code: "MATH-304",
      name: "Advanced Mathematics",
      finalGrade: "91% (A-)",
      gpaPoints: "3.7",
      assessments: [
        { name: "Homework 1 (Limits)", type: "Homework", score: "19/20", weight: "10%" },
        { name: "Homework 2 (Derivatives)", type: "Homework", score: "17/20", weight: "10%" },
        { name: "Quiz 1 (Calculus Intro)", type: "Quiz", score: "9/10", weight: "15%" },
        { name: "Midterm Examination", type: "Exam", score: "88/100", weight: "30%" },
        { name: "Final Project (Vector Mapping)", type: "Project", score: "95/100", weight: "35%" },
      ],
    },
    {
      code: "CHEM-202",
      name: "Chemistry & Lab",
      finalGrade: "94% (A)",
      gpaPoints: "4.0",
      assessments: [
        { name: "Lab Report 1: Oxidation", type: "Lab", score: "10/10", weight: "10%" },
        { name: "Lab Report 2: Kinetics", type: "Lab", score: "9.5/10", weight: "10%" },
        { name: "Midterm Exam", type: "Exam", score: "94/100", weight: "30%" },
        { name: "Homework Assignment (Thermodynamics)", type: "Homework", score: "18/20", weight: "15%" },
        { name: "Final Examination", type: "Exam", score: "95/100", weight: "35%" },
      ],
    },
    {
      code: "ENGL-102",
      name: "English Literature",
      finalGrade: "88% (B+)",
      gpaPoints: "3.3",
      assessments: [
        { name: "Reading Response Essay", type: "Essay", score: "8.5/10", weight: "15%" },
        { name: "Critical Analysis (Shakespeare)", type: "Essay", score: "26/30", weight: "25%" },
        { name: "Class Participation", type: "Other", score: "10/10", weight: "10%" },
        { name: "Midterm Oral Quiz", type: "Quiz", score: "17/20", weight: "15%" },
        { name: "Final Essay (Modern Themes)", type: "Essay", score: "89/100", weight: "35%" },
      ],
    },
    {
      code: "HIST-205",
      name: "World History",
      finalGrade: "92% (A-)",
      gpaPoints: "3.7",
      assessments: [
        { name: "Weekly Quiz Compilation", type: "Quiz", score: "46/50", weight: "20%" },
        { name: "Primary Source Analysis Paper", type: "Paper", score: "85/100", weight: "25%" },
        { name: "Midterm Exam", type: "Exam", score: "92/100", weight: "25%" },
        { name: "Final Research Presentation", type: "Project", score: "96/100", weight: "30%" },
      ],
    },
  ];

  const filteredCourses =
    selectedCourse === "all"
      ? coursesGrades
      : coursesGrades.filter((c) => c.code === selectedCourse);

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
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Loop */}
      <div className="space-y-6">
        {filteredCourses.map((course) => (
          <div key={course.code} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Header info */}
            <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold text-primary bg-blue-50 border border-blue-200 px-2 py-0.5 rounded mr-2">
                  {course.code}
                </span>
                <h2 className="text-md font-bold text-gray-900 inline-block mt-1 sm:mt-0">{course.name}</h2>
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
        ))}
      </div>
    </div>
  );
}
