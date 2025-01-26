"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";

interface QuestionData {
    question: string;
    answers: string[];
    correctAnswer: number;
    explanation: string;
}

export default function ProblemPage() {
    const router = useRouter();
    const params = useParams();

    // Safely handle `params.category` and ensure it's a string
    const category = decodeURIComponent(
        typeof params.category === "string" ? params.category : ""
    ); // Default to empty string if `params.category` is undefined or an array

    const [questionData, setQuestionData] = useState<QuestionData | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQuestion = async () => {
        setLoading(true);
        setShowFeedback(false);
        setSelectedAnswer(null);
        setError(null);

        try {
            const response = await fetch("/api/openai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt: generatePrompt(category),
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const parsedData = parseResultString(data.result); // Parse OpenAI response
                setQuestionData(parsedData);
            } else {
                console.error("Error fetching question:", data.error);
                setError(data.error || "Failed to fetch question.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const generatePrompt = (category: string) => {
        return `Generate a multiple-choice question about ${category} with four answer choices, but only one correct answer. Include the correct answer index and an explanation. In the explanation, include the correct answer. Use this example to format your responses:

Question: Which of the following is not a component of a comprehensive personal budget?

A) Housing Expenses
B) Entertainment Costs
C) Car Payment
D) Brand Preferences

Correct Answer: D) Brand Preferences

Explanation: Correct Answer: D, Brand Preferences. While personal preferences such as brand choices can indeed affect your spending, they do not constitute an official category in the budgeting process. All the other options like housing expenses, entertainment costs, and car payments are typical components of most personal budgets.`;
    };

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            setShowFeedback(true);
        }
    };

    const isCorrect = selectedAnswer === questionData?.correctAnswer;

    return (
        <div className="min-h-screen p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950">
            {/* Back to Categories Button */}
            <Button variant="ghost" className="mb-8" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
            </Button>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Question Card */}
                <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                            {questionData ? `Quiz Question - ${category}` : "Start a " + category + " Quiz"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {error && (
                            <div className="text-red-500 dark:text-red-400">
                                {error}
                            </div>
                        )}
                        {questionData ? (
                            <>
                                <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">
                                    {questionData.question}
                                </div>
                                <RadioGroup
                                    value={selectedAnswer !== null ? selectedAnswer.toString() : ""}
                                    onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
                                    className="space-y-3"
                                >
                                    {questionData.answers.slice(0, 4).map((answer, index) => (
                                        <div
                                            key={index}
                                            className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${selectedAnswer === index
                                                    ? "border-zinc-900 dark:border-zinc-100"
                                                    : "border-zinc-200 dark:border-zinc-700"
                                                }`}
                                        >
                                            <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                                            <Label
                                                htmlFor={`answer-${index}`}
                                                className="flex-grow cursor-pointer text-zinc-900 dark:text-zinc-100"
                                            >
                                                {answer}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </>
                        ) : (
                            <div className="text-center text-zinc-700 dark:text-zinc-300">
                                Click "Get a New Question" to start your quiz!
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            onClick={questionData ? handleSubmit : fetchQuestion}
                            className="w-full"
                            // disabled={loading || (questionData && selectedAnswer === null)}
                        >
                            {loading ? "Loading..." : questionData ? "Submit Answer" : "Get a New Question"}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Feedback Card */}
                {showFeedback && questionData && (
                    <Card
                        className={`border-zinc-200 dark:border-zinc-700 ${isCorrect ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                            }`}
                    >
                        <CardHeader>
                            <CardTitle className="flex items-center text-xl font-semibold">
                                {isCorrect ? (
                                    <>
                                        <CheckCircle2 className="mr-2 h-5 w-5 text-green-600" /> Correct!
                                    </>
                                ) : (
                                    <>
                                        <XCircle className="mr-2 h-5 w-5 text-red-600" /> Incorrect
                                    </>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-zinc-900 dark:text-zinc-100">{questionData.explanation}</p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={fetchQuestion} className="w-full" variant="outline">
                                Next Question
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    );
}

// Helper function to parse the result string from the OpenAI API
function parseResultString(resultString: string): QuestionData {
    const questionMatch = resultString.match(/Question:\s*(.*?)(\n\n|$)/);
    const question = questionMatch ? questionMatch[1].trim() : "";

    const answersMatch = resultString.match(/A\).*?\nB\).*?\nC\).*?\nD\).*/s);
    const answers = answersMatch
        ? answersMatch[0]
            .split("\n")
            .map((line) => line.replace(/^[A-D]\)\s*/, "").trim())
        : [];

    const correctAnswerMatch = resultString.match(/Correct Answer:\s*([A-D])\)/);
    const correctAnswerIndex = correctAnswerMatch ? "ABCD".indexOf(correctAnswerMatch[1]) : -1;

    const explanationMatch = resultString.match(/Explanation:\s*(.*)/s);
    const explanation = explanationMatch ? explanationMatch[1].trim() : "";

    return {
        question,
        answers,
        correctAnswer: correctAnswerIndex,
        explanation,
    };
}