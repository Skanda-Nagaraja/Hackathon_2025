import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      passwordHash: hashedPassword,
      totalGamesPlayed: 0,
      totalWins: 0,
      totalPoints: 0,
      categoryStats: {}, 
      gameHistory: [], 
    });

    await newUser.save();

    return NextResponse.json({ message: "User registered successfully", user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error in register route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
