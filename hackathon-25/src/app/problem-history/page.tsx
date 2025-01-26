"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

import {
    Card,
    CardHeader,
    CardContent,
    CardFooter,
    CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

export default function ProblemHistoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    console.log("searchParams", searchParams.get("problem"));
    // Retrieve problem data from the query string
    const problemString = searchParams.get("problem");
    const problem = problemString ? JSON.parse(problemString) : null;

    if (!problem) {
        return (
            <div className="min-h-screen p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                <p className="text-red-500">Error: Problem data not found.</p>
            </div>
        );
    }

    const {
        category,
        question,
        choices = [], // Default to an empty array if undefined
        correctAnswer,
        chosenOption,
        explanation,
        isCorrect,
    } = problem;

    return (
        <div className="min-h-screen p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950">
            {/* Back to Dashboard Button */}
            <Button
                variant="ghost"
                className="mb-8"
                onClick={() => router.push("/dashboard")}
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
            </Button>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Problem Details */}
                <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                            Problem Details - {category || "Unknown Category"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Question */}
                        <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                            {question || "No question available"}
                        </p>
                        {/* Answer Choices */}
                        {choices.length > 0 ? (
                            <ul className="space-y-2">
                                {choices.map((choice: string, index: number) => (
                                    <li
                                        key={index}
                                        className={`p-3 rounded-md border ${
                                            choice === correctAnswer
                                                ? "bg-green-100 dark:bg-green-800 border-green-500"
                                                : choice === chosenOption
                                                ? "bg-red-100 dark:bg-red-800 border-red-500"
                                                : "bg-gray-100 dark:bg-gray-800 border-gray-500"
                                        }`}
                                    >
                                        {choice}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-zinc-700 dark:text-zinc-300">
                                No answer choices available.
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        {/* Feedback */}
                        <div
                            className={`p-3 rounded-md text-white ${
                                isCorrect
                                    ? "bg-green-500 dark:bg-green-700"
                                    : "bg-red-500 dark:bg-red-700"
                            }`}
                        >
                            {isCorrect ? (
                                <div className="flex items-center">
                                    <CheckCircle2 className="mr-2 h-5 w-5" />
                                    Correct!
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <XCircle className="mr-2 h-5 w-5" />
                                    Incorrect
                                </div>
                            )}
                        </div>
                    </CardFooter>
                </Card>

                {/* Explanation */}
                <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                            Explanation
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-zinc-700 dark:text-zinc-300">
                            {explanation || "No explanation provided."}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
