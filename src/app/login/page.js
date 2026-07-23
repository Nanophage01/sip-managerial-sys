"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [portal, setPortal] = useState("student"); // "student" | "staff"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, portal }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(data.redirect);
      } else {
        setError(data.error || "Authentication failed.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("An error occurred connecting to the server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/" className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white text-sm font-bold">
              EM
            </div>
            <span className="text-xl font-bold text-primary">
              EduManage<span className="text-primary-light">Pro</span>
            </span>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Sign in to EduManage Pro
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your credentials to access your portal
          </p>
        </div>

        <div className="bg-white px-8 py-8 border border-gray-200 rounded-xl shadow-sm space-y-6">
          {/* Portal selector tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setPortal("student");
                setError("");
              }}
              className={`rounded-md py-2 text-sm font-medium text-center transition-colors ${
                portal === "student"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => {
                setPortal("staff");
                setError("");
              }}
              className={`rounded-md py-2 text-sm font-medium text-center transition-colors ${
                portal === "staff"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-primary"
              }`}
            >
              Staff
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@edumanage.com"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                Remember me
              </label>
              <a href="#" className="font-medium text-primary hover:text-primary-light">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
