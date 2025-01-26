"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react"

const problems = {
    Budgeting: {
        question: "What is the 50/30/20 rule in budgeting?",
        answers: [
            "50% needs, 30% wants, 20% savings",
            "50% savings, 30% needs, 20% wants",
            "50% wants, 30% savings, 20% needs",
            "50% needs, 30% savings, 20% wants",
        ],
        correctAnswer: 0,
        explanation:
            "The 50/30/20 rule suggests allocating 50% of your income to needs, 30% to wants, and 20% to savings and debt repayment.",
    },
}

export default function ProblemPage({ params }: { params: { category: string } }) {
    const router = useRouter()
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
    const [showFeedback, setShowFeedback] = useState(false)
    const [category, setCategory] = useState<string | null>(null)

    useEffect(() => {
        async function fetchParams() {
            const unwrappedParams = await params
            setCategory(unwrappedParams.category)
        }
        fetchParams()
    }, [params])

    if (!category) return <div>Loading...</div>

    const problem = problems[category as keyof typeof problems]
    if (!problem) return <div>Problem not found</div>

    const handleSubmit = () => {
        if (selectedAnswer !== null) {
            setShowFeedback(true)
        }
    }

    const isCorrect = selectedAnswer === problem.correctAnswer

    return (
        <div className="min-h-screen p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950">
            <Button variant="ghost" className="mb-8" onClick={() => router.push("/dashboard")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Categories
            </Button>

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Question Card */}
                <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{problem.question}</div>
                        <RadioGroup
                            value={selectedAnswer?.toString()}
                            onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
                            className="space-y-3"
                        >
                            {problem.answers.map((answer, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors
                    ${selectedAnswer === index
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
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSubmit} className="w-full" disabled={selectedAnswer === null || showFeedback}>
                            Submit Answer
                        </Button>
                    </CardFooter>
                </Card>

                {/* Explanation Card */}
                {showFeedback && (
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
                            <p className="text-zinc-900 dark:text-zinc-100">{problem.explanation}</p>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => router.push("/dashboard")} className="w-full" variant="outline">
                                Next Problem
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}