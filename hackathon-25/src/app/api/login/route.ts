import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongo";
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

    // Generate a simple token (for demonstration purposes)
    // You should use a proper authentication strategy like JWT in production
    const token = Buffer.from(`${user.username}:${new Date().getTime()}`).toString("base64");

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
