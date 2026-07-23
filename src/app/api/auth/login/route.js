import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "edumanage_secret_jwt_key_2026";

export async function POST(request) {
  try {
    await dbConnect();
    const { email, password, role } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Check if role matches selected login tab
    if (role && user.role !== role) {
      return NextResponse.json({ error: `This account does not have ${role} access permissions.` }, { status: 403 });
    }

    // Create JWT token payload
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      studentId: user.studentId || "",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        studentId: user.studentId || "",
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
