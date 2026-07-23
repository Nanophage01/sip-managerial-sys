import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Teacher from "@/models/Teacher";

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;
    const data = await request.json();

    const teacher = await Teacher.findOneAndUpdate(
      { teacherId: id },
      { $set: data },
      { new: true }
    );

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { id } = await params;

    const teacher = await Teacher.findOneAndDelete({ teacherId: id });

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Teacher deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
