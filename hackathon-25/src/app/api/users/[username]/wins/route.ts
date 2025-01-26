import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../../../models/User";

export async function PATCH(
    req: Request,
    { params }: { params: { username: string } }
) {
    try {
        // Wait for params to be resolved

        const p = await params;
        const username = p.username;
        if (!username) {
            return NextResponse.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        const { isWin } = await req.json();
        if (isWin === undefined) {
            return NextResponse.json(
                { error: "isWin parameter is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Prepare update object - always increment gamesPlayed, conditionally increment wins
        const updateObj = {
            $inc: {
                totalGamesPlayed: 1,
                ...(isWin ? { totalWins: 1 } : {})
            }
        };

        // Find and update the user's stats
        const updatedUser = await User.findOneAndUpdate(
            { username },
            updateObj,
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Game stats updated successfully",
            user: {
                username: updatedUser.username,
                totalGamesPlayed: updatedUser.totalGamesPlayed,
                totalWins: updatedUser.totalWins ?? 0,
                winRate: (updatedUser?.totalGamesPlayed || 0) > 0
                    ? ((updatedUser?.totalWins || 0) / (updatedUser?.totalGamesPlayed || 0) * 100).toFixed(1)
                    : "0.0"
            }
        });

    } catch (error) {
        console.error("Error updating game stats:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
