"use client";

import { useEffect, useState } from "react";

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  const [isLoading, setIsLoading] = useState(true);
  
  // Form States
  const [currentTeacher, setCurrentTeacher] = useState({ teacherId: "", name: "", email: "", department: "Mathematics", courses: "" });
  const [formError, setFormError] = useState("");

  // Fetch teachers on mount and search changes
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTeachers();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  async function fetchTeachers() {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/teachers?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setTeachers(data || []);
    } catch (err) {
      console.error("Failed to fetch teachers list:", err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenAdd = () => {
    const tempNum = Math.floor(100 + Math.random() * 900);
    setCurrentTeacher({ teacherId: `TC-${tempNum}`, name: "", email: "", department: "Mathematics", courses: "" });
    setModalMode("add");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (teacher) => {
    setCurrentTeacher({ ...teacher });
    setModalMode("edit");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (teacherId) => {
    if (confirm("Are you sure you want to delete this teacher record?")) {
      try {
        const res = await fetch(`/api/teachers/${teacherId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchTeachers();
        } else {
          const err = await res.json();
          alert(`Delete failed: ${err.error}`);
        }
      } catch (err) {
        console.error("Failed to delete teacher:", err);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!currentTeacher.name || !currentTeacher.email) {
      setFormError("Name and Email are required.");
      return;
    }

    try {
      let res;
      if (modalMode === "add") {
        res = await fetch("/api/teachers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentTeacher),
        });
      } else {
        res = await fetch(`/api/teachers/${currentTeacher.teacherId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(currentTeacher),
        });
      }

      if (res.ok) {
        setIsModalOpen(false);
        fetchTeachers();
      } else {
        const err = await res.json();
        setFormError(err.error || "Save operation failed.");
      }
    } catch (err) {
      console.error("Save failed:", err);
      setFormError("Save failed due to network error.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Registry</h1>
          <p className="text-sm text-gray-500">View, search, edit, and add instructor profiles.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors w-fit"
        >
          Add New Teacher
        </button>
      </div>

      {/* Control board: Search */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search teachers by name, department or courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Teacher List Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Teacher ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Department</th>
                <th className="px-6 py-3">Assigned Courses</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400 italic">
                    Loading teacher registry...
                  </td>
                </tr>
              ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400 italic">
                    No teacher records found matching your query.
                  </td>
                </tr>
              ) : (
                teachers.map((teacher) => (
                  <tr key={teacher.teacherId} className="hover:bg-gray-50/20">
                    <td className="px-6 py-4 font-bold text-gray-900">{teacher.teacherId}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{teacher.name}</td>
                    <td className="px-6 py-4 text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{teacher.department}</td>
                    <td className="px-6 py-4">
                      {teacher.courses ? (
                        teacher.courses.split(", ").map((c) => (
                          <span
                            key={c}
                            className="inline-block bg-blue-50 text-primary border border-blue-100 text-[9px] font-bold px-1.5 py-0.5 rounded mr-1.5"
                          >
                            {c}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 italic">None assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(teacher)}
                        className="text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(teacher.teacherId)}
                        className="text-xs font-semibold text-red-600 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-lg overflow-hidden">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900">{modalMode === "add" ? "Register New Teacher" : "Edit Teacher Profile"}</h2>
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

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teacher ID</label>
                <input
                  type="text"
                  value={currentTeacher.teacherId}
                  disabled
                  className="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={currentTeacher.name}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, name: e.target.value })}
                  placeholder="e.g. Dr. Jane Foster"
                  className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={currentTeacher.email}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, email: e.target.value })}
                  placeholder="e.g. jfoster@edumanage.com"
                  className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Department</label>
                <select
                  value={currentTeacher.department}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, department: e.target.value })}
                  className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none bg-white"
                >
                  {["Mathematics", "Science", "English", "History", "Computer Science", "Languages", "Arts"].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assigned Course Codes (comma separated)</label>
                <input
                  type="text"
                  value={currentTeacher.courses}
                  onChange={(e) => setCurrentTeacher({ ...currentTeacher, courses: e.target.value })}
                  placeholder="e.g. COMP-101, COMP-202"
                  className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                />
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
                  {modalMode === "add" ? "Register" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
