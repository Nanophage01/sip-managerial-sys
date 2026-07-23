import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { studentId: { $regex: search, $options: "i" } },
        ],
      };
    }

    const students = await Student.find(query).sort({ studentId: 1 });
    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    if (!data.studentId || !data.name || !data.email || !data.grade) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await Student.findOne({ studentId: data.studentId });
    if (existing) {
      return NextResponse.json({ error: "Student ID already exists" }, { status: 400 });
    }

    const student = await Student.create(data);
    return NextResponse.json(student, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
