import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import Course from "@/models/Course";
import Grade from "@/models/Grade";
import Attendance from "@/models/Attendance";
import User from "@/models/User";

export async function GET(request) {
  try {
    await dbConnect();

    // Check if database already has user data
    const userCount = await User.countDocuments();
    const force = new URL(request.url).searchParams.get("force") === "true";

    if (userCount > 0 && !force) {
      return NextResponse.json({
        message: "Database already seeded with users. Use ?force=true to re-seed.",
        stats: {
          users: userCount,
          students: await Student.countDocuments(),
          teachers: await Teacher.countDocuments(),
          courses: await Course.countDocuments(),
          grades: await Grade.countDocuments(),
          attendance: await Attendance.countDocuments(),
        }
      });
    }

    // Clear existing data
    await User.deleteMany({});
    await Student.deleteMany({});
    await Teacher.deleteMany({});
    await Course.deleteMany({});
    await Grade.deleteMany({});
    await Attendance.deleteMany({});

    // Seed Users with hashed passwords
    const adminPasswordHash = await bcrypt.hash("admin123", 10);
    const studentPasswordHash = await bcrypt.hash("student123", 10);
    const bobbyPasswordHash = await bcrypt.hash("bobby123", 10);

    const usersData = [
      {
        name: "System Administrator",
        email: "admin@edumanage.com",
        password: adminPasswordHash,
        role: "admin",
      },
      {
        name: "Jane Doe",
        email: "student@edumanage.com",
        password: studentPasswordHash,
        role: "student",
        studentId: "ST-202604",
      },
      {
        name: "Bobby Tables",
        email: "bobby@edumanage.com",
        password: bobbyPasswordHash,
        role: "student",
        studentId: "ST-202601",
      },
    ];
    await User.insertMany(usersData);

    // Seed Students
    const studentsData = [
      { studentId: "ST-202601", name: "Bobby Tables", email: "bobby@edumanage.com", grade: "12-A", status: "Enrolled" },
      { studentId: "ST-202602", name: "Alice Cooper", email: "alice@edumanage.com", grade: "10-B", status: "Enrolled" },
      { studentId: "ST-202603", name: "David Hasselhoff", email: "david@edumanage.com", grade: "12-C", status: "Suspended" },
      { studentId: "ST-202604", name: "Jane Doe", email: "student@edumanage.com", grade: "11-A", status: "Enrolled" },
      { studentId: "ST-202605", name: "John Smith", email: "john@edumanage.com", grade: "9-A", status: "Enrolled" },
      { studentId: "ST-202606", name: "Grace Hopper", email: "grace@edumanage.com", grade: "12-A", status: "Graduated" },
    ];
    await Student.insertMany(studentsData);

    // Seed Teachers
    const teachersData = [
      { teacherId: "TC-001", name: "Dr. Elizabeth Vance", email: "evance@edumanage.com", department: "Mathematics", courses: "MATH-304, MATH-101" },
      { teacherId: "TC-002", name: "Mr. Arthur Pendelton", email: "apendelton@edumanage.com", department: "Science", courses: "CHEM-202, CHEM-101" },
      { teacherId: "TC-003", name: "Ms. Sarah Jenkins", email: "sjenkins@edumanage.com", department: "English", courses: "ENGL-102, ENGL-201" },
      { teacherId: "TC-004", name: "Mr. Gregory House", email: "ghouse@edumanage.com", department: "History", courses: "HIST-205, HIST-101" },
      { teacherId: "TC-005", name: "Dr. Gordon Freeman", email: "gfreeman@edumanage.com", department: "Science", courses: "PHYS-301" },
      { teacherId: "TC-006", name: "Dr. Alan Turing", email: "aturing@edumanage.com", department: "Computer Science", courses: "COMP-101, COMP-202" },
    ];
    await Teacher.insertMany(teachersData);

    // Seed Courses
    const coursesData = [
      { code: "MATH-304", name: "Advanced Mathematics", teacher: "Dr. Elizabeth Vance", room: "Room 304", schedule: "Mon, Wed (08:30 AM - 09:45 AM)", studentsCount: 24 },
      { code: "CHEM-202", name: "Chemistry & Lab", teacher: "Mr. Arthur Pendelton", room: "Lab B", schedule: "Mon, Wed (10:00 AM - 11:15 AM)", studentsCount: 18 },
      { code: "ENGL-102", name: "English Literature", teacher: "Ms. Sarah Jenkins", room: "Room 102", schedule: "Tue, Thu (11:30 AM - 12:45 PM)", studentsCount: 30 },
      { code: "HIST-205", name: "World History", teacher: "Mr. Gregory House", room: "Room 205", schedule: "Tue, Thu (01:45 PM - 03:00 PM)", studentsCount: 22 },
      { code: "PHYS-301", name: "Introductory Physics", teacher: "Dr. Gordon Freeman", room: "Lab C", schedule: "Friday (09:00 AM - 12:00 PM)", studentsCount: 15 },
      { code: "COMP-101", name: "Computer Science I", teacher: "Dr. Alan Turing", room: "Computer Lab 1", schedule: "Friday (01:00 PM - 04:00 PM)", studentsCount: 28 },
    ];
    await Course.insertMany(coursesData);

    // Seed Grades
    const gradesData = [
      {
        studentId: "ST-202604",
        courseCode: "MATH-304",
        courseName: "Advanced Mathematics",
        finalGrade: "91% (A-)",
        gpaPoints: "3.7",
        assessments: [
          { name: "Homework 1 (Limits)", type: "Homework", weight: "10%", score: "19/20" },
          { name: "Homework 2 (Derivatives)", type: "Homework", weight: "10%", score: "17/20" },
          { name: "Quiz 1 (Calculus Intro)", type: "Quiz", weight: "15%", score: "9/10" },
          { name: "Midterm Examination", type: "Exam", weight: "30%", score: "88/100" },
          { name: "Final Project (Vector Mapping)", type: "Project", weight: "35%", score: "95/100" },
        ],
      },
      {
        studentId: "ST-202604",
        courseCode: "CHEM-202",
        courseName: "Chemistry & Lab",
        finalGrade: "94% (A)",
        gpaPoints: "4.0",
        assessments: [
          { name: "Lab Report 1: Oxidation", type: "Lab", weight: "10%", score: "10/10" },
          { name: "Lab Report 2: Kinetics", type: "Lab", weight: "10%", score: "9.5/10" },
          { name: "Midterm Exam", type: "Exam", weight: "30%", score: "94/100" },
          { name: "Homework Assignment (Thermodynamics)", type: "Homework", weight: "15%", score: "18/20" },
          { name: "Final Examination", type: "Exam", weight: "35%", score: "95/100" },
        ],
      },
      {
        studentId: "ST-202604",
        courseCode: "ENGL-102",
        courseName: "English Literature",
        finalGrade: "88% (B+)",
        gpaPoints: "3.3",
        assessments: [
          { name: "Reading Response Essay", type: "Essay", weight: "15%", score: "8.5/10" },
          { name: "Critical Analysis (Shakespeare)", type: "Essay", weight: "25%", score: "26/30" },
          { name: "Class Participation", type: "Other", weight: "10%", score: "10/10" },
          { name: "Midterm Oral Quiz", type: "Quiz", weight: "15%", score: "17/20" },
          { name: "Final Essay (Modern Themes)", type: "Essay", weight: "35%", score: "89/100" },
        ],
      },
      {
        studentId: "ST-202604",
        courseCode: "HIST-205",
        courseName: "World History",
        finalGrade: "92% (A-)",
        gpaPoints: "3.7",
        assessments: [
          { name: "Weekly Quiz Compilation", type: "Quiz", weight: "20%", score: "46/50" },
          { name: "Primary Source Analysis Paper", type: "Paper", weight: "25%", score: "85/100" },
          { name: "Midterm Exam", type: "Exam", weight: "25%", score: "92/100" },
          { name: "Final Research Presentation", type: "Project", weight: "30%", score: "96/100" },
        ],
      },
    ];
    await Grade.insertMany(gradesData);

    // Seed Attendance
    const attendanceData = [
      {
        courseCode: "COMP-101",
        date: new Date().toISOString().split("T")[0],
        records: [
          { studentId: "ST-202601", name: "Bobby Tables", status: "Present" },
          { studentId: "ST-202602", name: "Alice Cooper", status: "Present" },
          { studentId: "ST-202604", name: "Jane Doe", status: "Present" },
          { studentId: "ST-202605", name: "John Smith", status: "Late" },
        ]
      }
    ];
    await Attendance.insertMany(attendanceData);

    return NextResponse.json({
      message: "Database seeded successfully with hashed user credentials!",
      credentials: {
        admin: "admin@edumanage.com / admin123",
        student: "student@edumanage.com / student123",
        bobby: "bobby@edumanage.com / bobby123",
      },
      stats: {
        users: await User.countDocuments(),
        students: await Student.countDocuments(),
        teachers: await Teacher.countDocuments(),
        courses: await Course.countDocuments(),
        grades: await Grade.countDocuments(),
        attendance: await Attendance.countDocuments(),
      }
    });
  } catch (error) {
    console.error("Seeding failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
