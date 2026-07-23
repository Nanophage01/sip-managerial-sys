import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Attendance from "@/models/Attendance";
import Student from "@/models/Student";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const courseCode = searchParams.get("courseCode");
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

    if (!courseCode) {
      return NextResponse.json({ error: "Missing courseCode parameter" }, { status: 400 });
    }

    let record = await Attendance.findOne({ courseCode, date });

    if (!record) {
      const students = await Student.find({ status: "Enrolled" });
      const records = students.map((s) => ({
        studentId: s.studentId,
        name: s.name,
        status: "Present",
      }));
      return NextResponse.json({ courseCode, date, records, isNew: true });
    }

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    if (!data.courseCode || !data.date || !data.records) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const record = await Attendance.findOneAndUpdate(
      { courseCode: data.courseCode, date: data.date },
      { $set: { records: data.records } },
      { new: true, upsert: true }
    );

    return NextResponse.json(record);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
