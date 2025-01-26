import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User, { IUser } from "../../../../../models/User";

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  try {
    // Connect to the database
    await connectToDatabase();

    // Find the user by username
    const user = await User.findOne({ username }).exec();

    if (!user) {
      return NextResponse.json(
        { error: "User not found." },
        { status: 404 }
      );
    }

    // Exclude sensitive information like passwordHash
    const { passwordHash, ...userData } = user.toObject();

    return NextResponse.json(userData, { status: 200 });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}