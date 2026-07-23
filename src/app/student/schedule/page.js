"use client";

import { useEffect, useState } from "react";

export default function StudentSchedule() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const timeSlots = [
    "08:30 AM - 09:45 AM",
    "10:00 AM - 11:15 AM",
    "11:30 AM - 12:45 PM",
    "01:00 PM - 02:15 PM",
    "02:30 PM - 03:45 PM",
  ];

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        setCourses(data);
      } catch (err) {
        console.error("Failed to fetch schedule courses:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-gray-500">
        Loading schedule...
      </div>
    );
  }

  // Parse courses database data and fit it into our day-timeslot structure
  const scheduleData = {
    Monday: {},
    Tuesday: {},
    Wednesday: {},
    Thursday: {},
    Friday: {},
  };

  courses.forEach((course) => {
    const sched = course.schedule.toLowerCase();
    
    // Find time index based on course timing
    let timeIdx = -1;
    if (sched.includes("08:30")) timeIdx = 0;
    else if (sched.includes("10:00")) timeIdx = 1;
    else if (sched.includes("11:30")) timeIdx = 2;
    else if (sched.includes("01:00") || sched.includes("13:00") || sched.includes("1:00")) timeIdx = 3;
    else if (sched.includes("02:30") || sched.includes("14:30") || sched.includes("2:30")) timeIdx = 4;
    
    // If no match found, assign to slot based on array order
    if (timeIdx === -1) {
      if (sched.includes("09:00")) timeIdx = 0;
      else if (sched.includes("01:45") || sched.includes("13:45")) timeIdx = 4;
    }

    if (timeIdx !== -1) {
      if (sched.includes("mon") || sched.includes("monday")) {
        scheduleData.Monday[timeIdx] = { name: course.name, code: course.code, room: course.room };
      }
      if (sched.includes("tue") || sched.includes("tuesday")) {
        scheduleData.Tuesday[timeIdx] = { name: course.name, code: course.code, room: course.room };
      }
      if (sched.includes("wed") || sched.includes("wednesday")) {
        scheduleData.Wednesday[timeIdx] = { name: course.name, code: course.code, room: course.room };
      }
      if (sched.includes("thu") || sched.includes("thursday")) {
        scheduleData.Thursday[timeIdx] = { name: course.name, code: course.code, room: course.room };
      }
      if (sched.includes("fri") || sched.includes("friday")) {
        scheduleData.Friday[timeIdx] = { name: course.name, code: course.code, room: course.room };
      }
    }
  });

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

        {/* Mobile/Tablet List Schedule */}
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
