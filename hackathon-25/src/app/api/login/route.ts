import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongo";
import jwt from "jsonwebtoken";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 300 });
    }

    await connectToDatabase();

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || "secret",
        { expiresIn: "7d" }
      );
  


    return NextResponse.json({
      message: "Login successful",
      user: {
        username: user.username,
        totalGamesPlayed: user.totalGamesPlayed,
        totalWins: user.totalWins,
        categoryStats: user.categoryStats,
      },
      token, // Return the token (use something secure in production)
    });
  } catch (error) {
    console.error("Error in login route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
