"use client";

import { useState } from "react";

export default function StudentSchedule() {
  const timeSlots = [
    "08:30 AM - 09:45 AM",
    "10:00 AM - 11:15 AM",
    "11:30 AM - 12:45 PM",
    "01:00 PM - 02:15 PM",
    "02:30 PM - 03:45 PM",
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  // Mock schedule data mapping [day][timeSlotIndex]
  const scheduleData = {
    Monday: {
      0: { name: "Advanced Mathematics", code: "MATH-304", room: "Room 304" },
      1: { name: "Chemistry & Lab", code: "CHEM-202", room: "Lab B" },
      3: { name: "Study Hall / Advisor Meet", code: "STUDY-1", room: "Library" },
    },
    Tuesday: {
      1: { name: "Introductory Physics", code: "PHYS-301", room: "Lab C" },
      2: { name: "English Literature", code: "ENGL-102", room: "Room 102" },
      4: { name: "World History", code: "HIST-205", room: "Room 205" },
    },
    Wednesday: {
      0: { name: "Advanced Mathematics", code: "MATH-304", room: "Room 304" },
      1: { name: "Chemistry & Lab", code: "CHEM-202", room: "Lab B" },
    },
    Thursday: {
      2: { name: "English Literature", code: "ENGL-102", room: "Room 102" },
      4: { name: "World History", code: "HIST-205", room: "Room 205" },
    },
    Friday: {
      0: { name: "Computer Science I", code: "COMP-101", room: "Computer Lab 1" },
      1: { name: "Computer Science I", code: "COMP-101", room: "Computer Lab 1" },
      3: { name: "Physical Education", code: "PE-100", room: "Gymnasium" },
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Weekly Schedule</h1>
        <p className="text-sm text-gray-500">Your scheduled classes and lecture rooms for the active academic term.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        {/* Desktop Schedule Grid */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="w-40 px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200">
                  Time Slot
                </th>
                {days.map((day) => (
                  <th key={day} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider border-r border-gray-200 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {timeSlots.map((slot, slotIdx) => (
                <tr key={slotIdx} className="hover:bg-gray-50/50">
                  <td className="px-4 py-6 text-xs font-bold text-primary border-r border-gray-200 align-middle">
                    {slot}
                  </td>
                  {days.map((day) => {
                    const cell = scheduleData[day]?.[slotIdx];
                    return (
                      <td key={day} className="p-2 border-r border-gray-200 last:border-r-0 align-top h-28">
                        {cell ? (
                          <div className="h-full rounded border border-blue-200 bg-blue-50/50 p-2.5 flex flex-col justify-between">
                            <div>
                              <span className="text-[9px] font-bold text-primary block">{cell.code}</span>
                              <h3 className="text-xs font-bold text-gray-900 mt-1 leading-tight">{cell.name}</h3>
                            </div>
                            <span className="text-[10px] text-gray-500 mt-2 font-medium">{cell.room}</span>
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-[10px] text-gray-300 font-medium">
                            Free Slot
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet List Schedule (Accordion or Timeline view) */}
        <div className="lg:hidden p-4 space-y-6">
          {days.map((day) => {
            const dayClasses = scheduleData[day] || {};
            const activeSlots = Object.keys(dayClasses);

            return (
              <div key={day} className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2">{day}</h3>
                {activeSlots.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-1">No classes scheduled</p>
                ) : (
                  <div className="space-y-2">
                    {timeSlots.map((slot, slotIdx) => {
                      const item = dayClasses[slotIdx];
                      if (!item) return null;
                      return (
                        <div key={slotIdx} className="flex gap-4 p-3 border border-gray-200 rounded bg-white items-center">
                          <div className="w-28 flex-shrink-0">
                            <span className="text-[10px] font-bold text-primary block leading-none">{slot.split(" - ")[0]}</span>
                            <span className="text-[9px] text-gray-400 mt-1 block">{slot.split(" - ")[1]}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8px] font-bold text-primary bg-blue-50 border border-blue-200 rounded px-1">{item.code}</span>
                              <span className="text-xs font-bold text-gray-900 leading-tight">{item.name}</span>
                            </div>
                            <span className="text-[10px] text-gray-500 block mt-1">{item.room}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
