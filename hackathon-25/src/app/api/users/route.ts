import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../models/User";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in GET /api/users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { username, passwordHash } = body;

    if (!username || !passwordHash) {
      return NextResponse.json(
        { error: "Username and passwordHash are required" },
        { status: 400 }
      );
    }

    const newUser = new User({
      username,
      passwordHash,
      totalGamesPlayed: 0,
      totalWins: 0,
      categoryStats: {},
      gameHistory: [],
    });

    const savedUser = await newUser.save();
    return NextResponse.json(savedUser, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
