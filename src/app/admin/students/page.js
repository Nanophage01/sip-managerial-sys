"use client";

import { useState } from "react";

export default function AdminStudents() {
  // Mock initial student data
  const [students, setStudents] = useState([
    { id: "ST-202601", name: "Bobby Tables", email: "bobby@edumanage.com", grade: "11-A", status: "Enrolled" },
    { id: "ST-202602", name: "Alice Cooper", email: "alice@edumanage.com", grade: "10-B", status: "Enrolled" },
    { id: "ST-202603", name: "David Hasselhoff", email: "david@edumanage.com", grade: "12-C", status: "Suspended" },
    { id: "ST-202604", name: "Jane Doe", email: "student@edumanage.com", grade: "11-A", status: "Enrolled" },
    { id: "ST-202605", name: "John Smith", email: "john@edumanage.com", grade: "9-A", status: "Enrolled" },
    { id: "ST-202606", name: "Grace Hopper", email: "grace@edumanage.com", grade: "12-A", status: "Graduated" },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" | "edit"
  
  // Form States
  const [currentStudent, setCurrentStudent] = useState({ id: "", name: "", email: "", grade: "11-A", status: "Enrolled" });
  const [formError, setFormError] = useState("");

  const handleOpenAdd = () => {
    setCurrentStudent({ id: `ST-20260${students.length + 1}`, name: "", email: "", grade: "11-A", status: "Enrolled" });
    setModalMode("add");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (student) => {
    setCurrentStudent({ ...student });
    setModalMode("edit");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this student record?")) {
      setStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setFormError("");

    if (!currentStudent.name || !currentStudent.email) {
      setFormError("Name and Email are required.");
      return;
    }

    if (modalMode === "add") {
      // Check if student with same ID already exists (should not happen with our mock auto-inc)
      setStudents([...students, currentStudent]);
    } else {
      setStudents(students.map((s) => (s.id === currentStudent.id ? currentStudent : s)));
    }

    setIsModalOpen(false);
  };

  // Filter students based on search query
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Directory</h1>
          <p className="text-sm text-gray-500">View, search, edit, and add enrolled student profiles.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors w-fit"
        >
          Add New Student
        </button>
      </div>

      {/* Control board: Search */}
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search students by name, ID or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider">
                <th className="px-6 py-3">Student ID</th>
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email Address</th>
                <th className="px-6 py-3">Class Grade</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-400 italic">
                    No student records found matching your query.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/20">
                    <td className="px-6 py-4 font-bold text-gray-900">{student.id}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{student.name}</td>
                    <td className="px-6 py-4 text-gray-500">{student.email}</td>
                    <td className="px-6 py-4 font-medium text-gray-700">{student.grade}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold border ${
                          student.status === "Enrolled"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : student.status === "Suspended"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-3 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEdit(student)}
                        className="text-xs font-semibold text-primary hover:text-primary-light transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
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
          <div className="bg-white border border-gray-200 rounded-lg max-w-md w-full shadow-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-900">{modalMode === "add" ? "Add Student Profile" : "Edit Student Profile"}</h2>
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
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Student ID</label>
                <input
                  type="text"
                  value={currentStudent.id}
                  disabled
                  className="block w-full rounded border border-gray-300 bg-gray-50 px-3 py-1.5 text-xs text-gray-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={currentStudent.name}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  value={currentStudent.email}
                  onChange={(e) => setCurrentStudent({ ...currentStudent, email: e.target.value })}
                  placeholder="e.g. john@edumanage.com"
                  className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Class Grade</label>
                  <select
                    value={currentStudent.grade}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, grade: e.target.value })}
                    className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none bg-white"
                  >
                    {["9-A", "9-B", "10-A", "10-B", "11-A", "11-B", "12-A", "12-B", "12-C"].map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                  <select
                    value={currentStudent.status}
                    onChange={(e) => setCurrentStudent({ ...currentStudent, status: e.target.value })}
                    className="block w-full rounded border border-gray-300 px-3 py-1.5 text-xs text-gray-900 focus:border-primary focus:outline-none bg-white"
                  >
                    {["Enrolled", "Suspended", "Graduated", "Inactive"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
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
