import { NextResponse } from "next/server";
import User from "../../../../../models/User";
import { connectToDatabase } from "@/lib/mongo";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    await connectToDatabase();

    // Find the user containing the specific problem in `gameHistory`
    const user = await User.findOne({ "gameHistory._id": id }, { "gameHistory.$": 1 });

    if (!user || !user.gameHistory || user.gameHistory.length === 0) {
      return NextResponse.json({ error: "Problem not found" }, { status: 404 });
    }

    // Extract the specific game history entry
    const problem = user.gameHistory[0];

    return NextResponse.json(problem, { status: 200 });
  } catch (error) {
    console.error("Error fetching problem data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
