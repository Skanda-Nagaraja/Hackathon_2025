import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongo";
import User from "../../../../models/User";

export async function POST(req: Request) {
    try {
        const { username, category, question, choices, chosenOption, isCorrect, playedAt, correctAnswer, explanation } = await req.json();
        console.log("Received data:", { username, category, question, choices, chosenOption, isCorrect, playedAt, correctAnswer, explanation });
        if (!username || !category || !question || !choices || chosenOption === undefined || isCorrect === undefined || !playedAt || correctAnswer === undefined || explanation === undefined) {
            return NextResponse.json(
                { error: "All fields (username, category, question, choices, chosenOption, isCorrect, playedAt, correctAnswer, explanation) are required" },
                { status: 400 }
            );
        }

        await connectToDatabase();


        const user = await User.findOne({ username });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.gameHistory) {
            user.gameHistory = [];
        }

        const newGameHistoryEntry = {
            category,
            question,
            choices,
            chosenOption,
            isCorrect,
            playedAt,
            correctAnswer,
            explanation,
        };

        // console.log("New game history entry:", newGameHistoryEntry);


        user.gameHistory.push(newGameHistoryEntry);

        console.log("New game history entry:", user.gameHistory[user.gameHistory.length - 1]);

        if (!user.categoryStats) {
            user.categoryStats = new Map();
        }

        const currentCategoryStats = user.categoryStats.get(category) || {
            gamesPlayed: 0,
            correctAnswers: 0,
            winPercentage: 0,
        };

        currentCategoryStats.gamesPlayed += 1;
        if (isCorrect) {
            currentCategoryStats.correctAnswers += 1;
        }
        currentCategoryStats.winPercentage = (currentCategoryStats.correctAnswers / currentCategoryStats.gamesPlayed) * 100;

        user.categoryStats.set(category, currentCategoryStats);

        user.markModified("categoryStats");

        if (!user.totalGamesPlayed) {
            user.totalGamesPlayed = 0;
        }
        user.totalGamesPlayed += 1;

        await user.save();

        // const savedUser = await user.save();

        // if (!savedUser) {
        //     return NextResponse.json({ error: "Error saving user game history" }, { status: 500 });
        // }

        // if (!savedUser.gameHistory) {
        //     return NextResponse.json({ error: "Error saving user game history" }, { status: 500 });
        // }

        // console.log("Saved user game history:", savedUser.gameHistory[savedUser.gameHistory.length - 1]);
        
        return NextResponse.json({ message: "Game history added successfully", user }, { status: 200 });
    } catch (error) {
        console.error("Error in add game history route:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}