import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Course from "@/models/Course";

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const { code } = await params;

    const course = await Course.findOneAndDelete({ code: code.toUpperCase() });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
