"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Problem {
    category: string;
    question: string;
    choices: string[];
    chosenOption: string;
    isCorrect: boolean;
    playedAt: string;
    correctAnswer: string;
    explanation: string;
}

export default function ProblemHistoryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const { username, timestamp } = params;

    const [problem, setProblem] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                const decodedTimestamp = decodeURIComponent(timestamp as string);
                const response = await fetch(`/api/game-history/${username}/${decodedTimestamp}`, {
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch problem data");
                }

                const data = await response.json();
                setProblem(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        if (username && timestamp) {
            fetchProblem();
        }
    }, [username, timestamp]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="text-xl">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    if (!problem) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="text-xl text-red-500">Problem not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-8 bg-zinc-50 dark:bg-zinc-950">
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => router.push("/user-dashboard")}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>

                {/* Problem Details */}
                <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Problem Details</h2>
                    <p className="mb-2"><strong>Category:</strong> {problem.category}</p>
                    <p className="mb-4"><strong>Question:</strong> {problem.question}</p>
                    <div className="mb-4">
                        <strong>Choices:</strong>
                        <ul className="list-disc list-inside">
                            {problem.choices.map((choice, index) => (
                                <li key={index}>
                                    {choice}
                                    {choice === problem.correctAnswer && (
                                        <span className="ml-2 text-green-600 font-bold">(Correct)</span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <p className="mb-2"><strong>Chosen Option:</strong> {problem.chosenOption}</p>
                    <p className="mb-2">
                        <strong>Result:</strong>{" "}
                        <span className={problem.isCorrect ? "text-green-600" : "text-red-600"}>
                            {problem.isCorrect ? "Correct" : "Incorrect"}
                        </span>
                    </p>
                    <p className="mb-4"><strong>Played At:</strong> {new Date(problem.playedAt).toLocaleString()}</p>
                    <div>
                        <strong>Explanation:</strong>
                        <p className="mt-2">{problem.explanation}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}