import { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

// GET request handler
export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST request handler
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, passwordHash } = body;

    if (!username || !passwordHash) {
      return NextResponse.json({ error: "Username and passwordHash are required" }, { status: 400 });
    }

    await connectToDatabase();

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
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
