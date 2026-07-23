"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch student profile for Jane Doe
        const resStudent = await fetch("/api/students?search=ST-202604");
        const studentsData = await resStudent.json();
        if (studentsData.length > 0) {
          setStudent(studentsData[0]);
        }

        // Fetch grades for Jane Doe
        const resGrades = await fetch("/api/grades?studentId=ST-202604");
        const gradesData = await resGrades.json();
        setGrades(gradesData);

        // Fetch courses list
        const resCourses = await fetch("/api/courses");
        const coursesData = await resCourses.json();
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const announcements = [
    { title: "Science Fair Registration Open", content: "Submit your proposals for the annual science fair by next Friday. Prizes will be awarded for top three projects.", date: "July 22, 2026" },
    { title: "Parent-Teacher Conferences", content: "Conferences will be held on August 4th. Booking schedules will open online next Monday.", date: "July 20, 2026" },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-gray-500">
        Loading dashboard data...
      </div>
    );
  }

  // Calculate stats dynamically
  const enrolledCount = grades.length > 0 ? grades.length : 4;
  const avgGpa = grades.length > 0 
    ? (grades.reduce((sum, g) => sum + parseFloat(g.gpaPoints), 0) / grades.length).toFixed(2)
    : "3.85";

  const stats = [
    { label: "Current GPA", value: avgGpa, detail: "Calculated from course list" },
    { label: "Attendance", value: "96.4%", detail: "Target: >95%" },
    { label: "Courses", value: `${enrolledCount} Enrolled`, detail: "Semester 2" },
    { label: "Assignments", value: "3 Pending", detail: "Due this week" },
  ];

  // Map courses to class schedules
  const todayClasses = courses.length > 0 
    ? courses.slice(0, 4).map(c => ({
        time: c.schedule.includes("(") ? c.schedule.substring(c.schedule.indexOf("(")+1, c.schedule.indexOf(")")) : c.schedule,
        subject: c.name,
        room: c.room,
        teacher: c.teacher
      }))
    : [
        { time: "08:30 AM - 09:45 AM", subject: "Advanced Mathematics", room: "Room 304", teacher: "Dr. Elizabeth Vance" },
        { time: "10:00 AM - 11:15 AM", subject: "Chemistry & Lab", room: "Lab B", teacher: "Mr. Arthur Pendelton" },
        { time: "11:30 AM - 12:45 PM", subject: "English Literature", room: "Room 102", teacher: "Ms. Sarah Jenkins" },
        { time: "01:45 PM - 03:00 PM", subject: "World History", room: "Room 205", teacher: "Mr. Gregory House" },
      ];

  // Extract recent grade updates dynamically from DB grades
  const recentGrades = grades.length > 0 
    ? grades.flatMap(g => g.assessments.slice(0, 1).map(a => ({
        subject: g.courseName,
        type: a.name,
        score: a.score,
        date: "Recent"
      }))).slice(0, 3)
    : [
        { subject: "Chemistry & Lab", type: "Midterm Exam", score: "94/100", date: "Yesterday" },
        { subject: "Advanced Mathematics", type: "Calculus Homework 4", score: "18/20", date: "2 days ago" },
        { subject: "English Literature", type: "Essay draft", score: "A-", date: "4 days ago" },
      ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500">Welcome, {student ? student.name : "Jane Doe"}. Overview of your academic standing and daily timeline.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="mt-1 text-xs text-gray-400">{stat.detail}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Class Schedule</h2>
          </div>
          <div className="divide-y divide-gray-100 px-5 py-2">
            {todayClasses.map((cls, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-1.5 sm:gap-4">
                <div>
                  <p className="text-xs font-semibold text-primary">{cls.time}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">{cls.subject}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs text-gray-600">{cls.teacher}</p>
                  <p className="text-xs font-medium text-gray-400 mt-0.5">{cls.room}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grades */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="font-semibold text-gray-900">Recent Grades</h2>
          </div>
          <div className="divide-y divide-gray-100 px-5 py-2">
            {recentGrades.map((gr, idx) => (
              <div key={idx} className="py-3 flex justify-between items-center">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{gr.subject}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{gr.type}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded border border-green-200">
                    {gr.score}
                  </span>
                  <p className="text-[10px] text-gray-400 mt-1">{gr.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">School Announcements</h2>
        </div>
        <div className="divide-y divide-gray-100 p-5 space-y-4">
          {announcements.map((ann, idx) => (
            <div key={idx} className={`${idx > 0 ? "pt-4" : ""} first:pt-0`}>
              <div className="flex justify-between items-start gap-4">
                <h3 className="text-sm font-bold text-gray-900">{ann.title}</h3>
                <span className="text-[11px] text-gray-400">{ann.date}</span>
              </div>
              <p className="mt-1.5 text-xs text-gray-600 leading-relaxed">{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
