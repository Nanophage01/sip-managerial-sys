"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const metrics = [
    { label: "Total Students", value: "1,248", detail: "+12 new this month" },
    { label: "Active Teachers", value: "82", detail: "4 departments" },
    { label: "Total Courses", value: "48", detail: "Across 6 grades" },
    { label: "Daily Attendance", value: "95.6%", detail: "Avg for today" },
  ];

  const quickActions = [
    { name: "Manage Students", description: "View list, add new entries, or edit records.", href: "/admin/students", actionText: "Go to Students" },
    { name: "Manage Teachers", description: "Manage instructor profiles and departments.", href: "/admin/teachers", actionText: "Go to Teachers" },
    { name: "Class Scheduling", description: "Create new courses and assign teachers.", href: "/admin/courses", actionText: "Go to Courses" },
    { name: "Attendance Records", description: "Review and take class attendance sheets.", href: "/admin/attendance", actionText: "Go to Attendance" },
  ];

  const recentActivities = [
    { message: "New student registration submitted for 'Marcus Aurelius'", category: "Student Management", time: "15 minutes ago" },
    { message: "Dr. Elizabeth Vance requested a room swap for MATH-304 on Wednesdays", category: "Scheduling", time: "1 hour ago" },
    { message: "Attendance report finalized for Grade 10-B", category: "Attendance", time: "3 hours ago" },
    { message: "Teacher account created for new Science assistant 'Jane Foster'", category: "Teacher Management", time: "Yesterday" },
    { message: "Grade thresholds adjusted for midterm term weighting", category: "System Settings", time: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
        <p className="text-sm text-gray-500">System overview, shortcuts, and recent administrative history.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{m.label}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{m.value}</p>
            <p className="mt-1 text-xs text-gray-400">{m.detail}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-md font-bold text-gray-900 mb-4">Quick Management Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickActions.map((qa, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900">{qa.name}</h3>
                <p className="mt-1 text-xs text-gray-600 leading-relaxed">{qa.description}</p>
              </div>
              <button
                onClick={() => router.push(qa.href)}
                className="mt-4 inline-flex items-center text-xs font-semibold text-primary hover:text-primary-light w-fit"
              >
                {qa.actionText} →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">Recent Admin Activities</h2>
        </div>
        <div className="divide-y divide-gray-100 px-5 py-2">
          {recentActivities.map((act, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4">
              <div>
                <p className="text-xs text-gray-900 font-medium">{act.message}</p>
                <span className="inline-block bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded mt-1 border border-gray-200">
                  {act.category}
                </span>
              </div>
              <div className="text-left sm:text-right flex-shrink-0">
                <span className="text-[10px] text-gray-400">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
