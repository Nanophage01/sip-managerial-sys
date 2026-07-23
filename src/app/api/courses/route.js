import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";

export async function GET() {
  try {
    await dbConnect();
    const courses = await Course.find({}).sort({ code: 1 });
    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    if (!data.code || !data.name || !data.teacher || !data.room || !data.schedule) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await Course.findOne({ code: data.code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Course code already exists" }, { status: 400 });
    }

    const course = await Course.create({
      ...data,
      code: data.code.toUpperCase()
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
