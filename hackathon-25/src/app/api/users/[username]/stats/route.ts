// src/app/api/users/[username]/route.ts

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../../../models/User";

export async function GET(
    request: NextRequest,
    { params }: { params: { username: string } }
) {
    const { username } = params;

    if (!username || typeof username !== "string") {
        return NextResponse.json(
            { error: "Invalid username parameter." },
            { status: 400 }
        );
    }

    try {
        console.log("Connecting to database...");
        await connectToDatabase();
        console.log("Connected to database.");

        console.log(`Fetching user with username: ${username}`);
        const user = await User.findOne({ username }).exec();

        if (!user) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }

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