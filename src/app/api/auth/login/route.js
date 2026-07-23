import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "edumanage_secret_jwt_key_2026";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password, portal } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Verify user belongs to the selected portal
    if (portal === "student" && user.role !== "student") {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }
    if (portal === "staff" && user.role !== "admin" && user.role !== "teacher") {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Determine redirect path based on actual role
    let redirect = "/student/dashboard";
    if (user.role === "admin") redirect = "/admin/dashboard";
    if (user.role === "teacher") redirect = "/teacher/dashboard";

    // Create JWT token payload
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentId: user.studentId || "",
      teacherId: user.teacherId || "",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Login successful",
      redirect,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId || "",
        teacherId: user.teacherId || "",
      },
    });

    // Set HTTP-only Cookie
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 86400,
    });

    return response;
  } catch (error) {
    console.error("Auth login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
