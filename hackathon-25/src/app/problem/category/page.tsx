"use client"

import { useState } from "react"
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
  // Add more problems for other categories here
}

export default function ProblemPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)

  const category = decodeURIComponent(params.category)
  const problem = problems[category as keyof typeof problems]

  if (!problem) {
    return <div>Problem not found</div>
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowFeedback(true)
    }
  }

  const isCorrect = selectedAnswer === problem.correctAnswer

  return (
    <div className="min-h-screen p-4 md:p-8">
      <Button variant="ghost" className="mb-8" onClick={() => router.push("/")}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Categories
      </Button>

      <Card className="max-w-2xl mx-auto border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-slate-900 dark:text-slate-100">{category}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-lg font-medium text-slate-900 dark:text-slate-100">{problem.question}</div>
          <RadioGroup
            value={selectedAnswer?.toString()}
            onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
            className="space-y-3"
          >
            {problem.answers.map((answer, index) => (
              <div
                key={index}
                className={`flex items-center space-x-2 rounded-lg border p-4 transition-colors
                  ${
                    selectedAnswer === index
                      ? "border-slate-900 dark:border-slate-100"
                      : "border-slate-200 dark:border-slate-700"
                  }`}
              >
                <RadioGroupItem value={index.toString()} id={`answer-${index}`} />
                <Label
                  htmlFor={`answer-${index}`}
                  className="flex-grow cursor-pointer text-slate-900 dark:text-slate-100"
                >
                  {answer}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleSubmit} className="w-full" disabled={selectedAnswer === null || showFeedback}>
            Submit Answer
          </Button>

          {showFeedback && (
            <div
              className={`w-full p-4 rounded-lg ${
                isCorrect
                  ? "bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100"
                  : "bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-100"
              }`}
            >
              <div className="flex items-center mb-2">
                {isCorrect ? <CheckCircle2 className="mr-2 h-5 w-5" /> : <XCircle className="mr-2 h-5 w-5" />}
                <span className="font-medium">{isCorrect ? "Correct!" : "Incorrect"}</span>
              </div>
              <p className="text-sm">{problem.explanation}</p>
              <Button onClick={() => router.push("/")} className="mt-4 w-full" variant="outline">
                Next Problem
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

