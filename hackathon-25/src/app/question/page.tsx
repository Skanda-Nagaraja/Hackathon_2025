"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function QuestionPage() {
    const [questionData, setQuestionData] = useState<{
        question: string;
        answers: string[];
        correctAnswer: number;
        explanation: string;
    } | null>(null);

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchQuestion = async () => {
        setLoading(true);
        setShowFeedback(false);
        setSelectedAnswer(null);

        try {
            const response = await fetch("/api/openai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    prompt:
                        "Generate a multiple-choice question about budgeting with four answers. Include the correct answer index and an explanation in JSON format.",
                }),
            });

            const data = await response.json();
            if (response.ok) {
                const parsedData = JSON.parse(data.result);
                setQuestionData(parsedData);
            } else {
                console.error("Error fetching question:", data.error);
            }
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = () => {
        setShowFeedback(true);
    };

    const isCorrect = selectedAnswer === questionData?.correctAnswer;

    return (
        <div className="min-h-screen p-4 md:p-8">
            <h1 className="text-2xl font-bold text-center mb-6">AI-Powered Quiz</h1>

            <div className="flex justify-center mb-8">
                <Button onClick={fetchQuestion} disabled={loading}>
                    {loading ? "Loading Question..." : "Get a New Question"}
                </Button>
            </div>

            {questionData && (
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <h2 className="text-lg font-semibold">{questionData.question}</h2>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup
                            value={selectedAnswer?.toString() || ""}
                            onValueChange={(value) => setSelectedAnswer(Number(value))}
                            className="space-y-4"
                        >
                            {questionData.answers.map((answer, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors ${selectedAnswer === index
                                            ? "border-blue-500"
                                            : "border-gray-300"
                                        }`}
                                >
                                    <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                                    <Label htmlFor={`answer-${index}`} className="flex-grow">
                                        {answer}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button onClick={handleSubmit} disabled={selectedAnswer === null || showFeedback}>
                            Submit Answer
                        </Button>

                        {showFeedback && (
                            <div
                                className={`mt-6 p-4 rounded-lg ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}
                            >
                                <p className="font-medium">{isCorrect ? "Correct!" : "Incorrect"}</p>
                                <p className="mt-2">{questionData.explanation}</p>
                            </div>
                        )}
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}