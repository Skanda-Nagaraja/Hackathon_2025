"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { ArrowLeft, LogOut, Trophy } from "lucide-react"
import Link from "next/link"

// Mock data for the problem history
const problemHistory = [
  { id: 1, category: "Budgeting", correct: true },
  { id: 2, category: "Investments", correct: false },
  { id: 3, category: "Credit & Loans", correct: true },
  { id: 4, category: "Savings", correct: true },
  { id: 5, category: "Taxes", correct: false },
  // Add more entries as needed
]

// Mock data for the pie chart
const categoryData = [
  { name: "Budgeting", value: 30 },
  { name: "Investments", value: 20 },
  { name: "Credit & Loans", value: 15 },
  { name: "Savings", value: 25 },
  { name: "Taxes", value: 10 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// Mock data for user statistics
const userStats = {
  totalGames: 50,
  totalWins: 35,
  winRate: 70,
  rank: 42,
}

export default function UserDashboard() {
  const router = useRouter()
  const username = "John Doe" // This would typically come from a user context or state
  const totalPoints = 1234 // This would typically come from user data

  const handleLogout = () => {
    // Implement logout logic here
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <h1 className="text-4xl font-bold text-center text-zinc-900 dark:text-zinc-100">Hello, {username}</h1>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Total Points</h2>
                <p className="text-6xl font-bold text-amber-500">{totalPoints}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Total Games</h3>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{userStats.totalGames}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Total Wins</h3>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{userStats.totalWins}</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Win Rate</h3>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{userStats.winRate}%</p>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">Rank</h3>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-center">
                    <Trophy className="w-6 h-6 mr-2 text-amber-500" />
                    {userStats.rank}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Problem History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Result</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {problemHistory.map((problem) => (
                      <TableRow key={problem.id} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                        <TableCell>
                          <Link
                            href={`/problem/${encodeURIComponent(problem.category)}`}
                            className="hover:underline"
                          >
                            {problem.category}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <span className={problem.correct ? "text-green-600" : "text-red-600"}>
                            {problem.correct ? "Correct" : "Incorrect"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 italic">
                Click on a category to generate a new problem
              </p>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-4">
                  {categoryData.map((entry, index) => (
                    <div key={entry.name} className="flex items-center">
                      <div className="w-3 h-3 mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <span className="text-sm">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Advice</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-700 dark:text-zinc-300">
                  Based on your performance, we recommend focusing more on Investments and Taxes. Try to allocate more
                  time to these categories to improve your overall financial literacy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

