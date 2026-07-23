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

export async function POST(request) {
  try {
    await dbConnect();
    const { studentId, courseCode, courseName, assessment } = await request.json();

    if (!studentId || !courseCode || !assessment) {
      return NextResponse.json(
        { error: "Missing required fields: studentId, courseCode, assessment" },
        { status: 400 }
      );
    }

    // Check if a grade record already exists for this student + course
    let gradeRecord = await Grade.findOne({ studentId, courseCode });

    if (gradeRecord) {
      // Append the new assessment to existing record
      gradeRecord.assessments.push(assessment);
      await gradeRecord.save();
    } else {
      // Create a new grade record
      gradeRecord = await Grade.create({
        studentId,
        courseCode,
        courseName: courseName || courseCode,
        finalGrade: "Pending",
        gpaPoints: "0.0",
        assessments: [assessment],
      });
    }

    return NextResponse.json(gradeRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
