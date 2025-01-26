import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../../../models/User";
import { NextRequest } from 'next/server';

export async function PATCH(
    req,
    context
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
    request,
    { params, searchParams }
) {
    const { username } = params;

    try {
        const { db } = await connectToDatabase();

        // Fetch the user by username
        const user = await db.collection('users').findOne({ username });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Assuming `totalPoints` is a field in your user document
        return NextResponse.json({ points: user.totalPoints }, { status: 200 });
    } catch (error) {
        console.error('Error fetching user points:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
