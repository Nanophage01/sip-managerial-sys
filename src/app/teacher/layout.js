"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function TeacherLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user.role !== "teacher") {
            router.push("/login");
            return;
          }
          setUser(data.user);
        } else {
          router.push("/login");
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    }
    fetchUser();
  }, [router]);

  const navigation = [
    { name: "Dashboard", href: "/teacher/dashboard" },
    { name: "My Classes", href: "/teacher/classes" },
    { name: "Attendance", href: "/teacher/attendance" },
    { name: "Gradebook", href: "/teacher/gradebook" },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      router.push("/login");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center px-6 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-white text-xs font-bold">
              EM
            </div>
            <span className="text-lg font-bold text-primary">
              EduManage<span className="text-primary-light">Pro</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-4 overflow-y-auto">
          <div className="px-3 mb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Instructor Panel
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gray-100 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-4 px-3">
            <p className="text-xs text-gray-400 font-medium">Signed in as</p>
            <p className="text-sm font-semibold text-gray-800 truncate">{user ? user.name : "Instructor"}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between px-6 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-4 md:hidden">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-white text-xs font-bold">
                EM
              </div>
              <span className="text-md font-bold text-primary">
                EduManage
              </span>
            </div>
          </div>

          <div className="hidden md:block text-sm text-gray-500">
            Welcome back, <span className="font-semibold text-gray-800">{user ? user.name : "Instructor"}</span>
            {user?.teacherId ? ` (ID: ${user.teacherId})` : ""}
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Instructor
            </span>

            <button
              onClick={handleLogout}
              className="md:hidden text-sm font-medium text-red-600 hover:text-red-700"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Mobile Sub-Navigation Bar */}
        <nav className="flex md:hidden border-b border-gray-200 bg-white overflow-x-auto px-4 py-2 gap-2 scrollbar-none">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Scrollable View Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
