import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/Teacher";

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
          { department: { $regex: search, $options: "i" } },
          { teacherId: { $regex: search, $options: "i" } },
        ],
      };
    }

    const teachers = await Teacher.find(query).sort({ teacherId: 1 });
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const data = await request.json();

    if (!data.teacherId || !data.name || !data.email || !data.department) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const existing = await Teacher.findOne({ teacherId: data.teacherId });
    if (existing) {
      return NextResponse.json({ error: "Teacher ID already exists" }, { status: 400 });
    }

    const teacher = await Teacher.create(data);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
