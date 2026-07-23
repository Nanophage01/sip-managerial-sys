import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Grade from "@/models/Grade";

export async function GET(request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");

    let query = {};
    if (studentId) {
      query = { studentId };
    }

    const grades = await Grade.find(query);
    return NextResponse.json(grades);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
