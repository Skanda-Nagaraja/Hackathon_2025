import { NextResponse } from "next/server";
import User from "../../../../../../models/User";
import { connectToDatabase } from "@/lib/mongo";

export async function GET(
    req: Request,
    { params }: { params: { username: string; timestamp: string } }
) {
    const { username, timestamp } = await params;

    

    // Validate parameters
    if (!username || !timestamp) {
        return NextResponse.json(
            { error: "Username and timestamp are required." },
            { status: 400 }
        );
    }
    else{
        console.log("username", username);
        console.log("timestamp", timestamp);
    }

    try {
        await connectToDatabase();

        // Parse the timestamp back to Date
        const playedAtDate = new Date(decodeURIComponent(timestamp));

        // Find the user and the specific game history entry
        const user = await User.findOne({
            username: username
        });

        
        
        if (!user || !user.gameHistory || user.gameHistory.length === 0) {
            return NextResponse.json({ error: "Problem not found." }, { status: 404 });
        }

            // Start of Selection
            const problem = user.gameHistory.find(
                (item) => new Date(item.playedAt).getTime() === playedAtDate.getTime()
            );

        return NextResponse.json(problem, { status: 200 });
    } catch (error) {
        console.error("Error fetching problem data:", error);
        return NextResponse.json(
            { error: "Internal Server Error." },
            { status: 500 }
        );
    }
}