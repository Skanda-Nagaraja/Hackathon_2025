import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../../../models/User";

export async function PATCH(
    req: Request,
    context: { params: { username: string } }
) {
    try {
        const p = await context.params;
        const username = p.username;
        const { points } = await req.json();

        if (points === undefined) {
            return NextResponse.json(
                { error: "Points value is required" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        // Find and update the user's points
        const updatedUser = await User.findOneAndUpdate(
            { username },
            { $inc: { totalPoints: points } }, // Using $inc to add to existing points
            { new: true } // Return the updated document
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            message: "Points updated successfully",
            user: {
                username: updatedUser.username,
                totalPoints: updatedUser.totalPoints,
            }
        });
    } catch (error) {
        console.error("Error updating points:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
export async function GET(
    req: Request,
    context: { params: { username: string } }
) {
    try {
        const username =  context.params.username;

        await connectToDatabase();

        const user = await User.findOne({ username });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            username: user.username,
            totalPoints: user.totalPoints || 0
        });

    } catch (error) {
        console.error("Error fetching points:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
