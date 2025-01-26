import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../../../models/User";

export async function PATCH(
    req: Request,
    { params }: { params: { username: string } }
) {
    try {
        const { username } = params;
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
                totalWins: updatedUser.totalWins,
                winRate: updatedUser.totalGamesPlayed > 0
                    ? (updatedUser.totalWins / updatedUser.totalGamesPlayed * 100).toFixed(1)
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
