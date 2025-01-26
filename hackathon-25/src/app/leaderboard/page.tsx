"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, User, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

import { UserProvider, useUser } from "../../contexts/UserContext"

import  ModeToggle  from "@/components/mode-toggle"



import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"





export default function LeaderboardPage() {
  const router = useRouter()
  const { user } = useUser()

// Define the user type
interface LeaderboardUser {
  username: string
  totalPoints: number
}

const [leaderboardData, setLeaderboardData] = useState<(LeaderboardUser & { rank: number })[]>([])
const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard')
        const data = await response.json()

        // Add rank to each user and sort by points
        const rankedData = data
          .sort((a: LeaderboardUser, b: LeaderboardUser) => b.totalPoints - a.totalPoints)
          .map((user: LeaderboardUser, index: number) => ({
            ...user,
            rank: index + 1
          }))
        console.log(rankedData)
        setLeaderboardData(rankedData)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])


  const handleLogout = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100">
            <Trophy className="w-5 h-5" />
            <span className="font-medium">{user?.points || 0} points</span>
          </div>

          <Button variant="ghost" className="text-zinc-900 dark:text-zinc-100">
            <Trophy className="w-5 h-5 mr-2" />
            Leaderboard
          </Button>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-zinc-900 dark:text-zinc-100">
                  <User className="w-5 h-5 mr-2" />
                  {user?.username}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/user-dashboard">User Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-8" onClick={() => router.push("/dashboard")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-center mb-8">
          <Trophy className="w-8 h-8 mr-3 text-yellow-500" />
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">Leaderboard</h1>
        </div>

        <div className="border rounded-lg border-zinc-200 dark:border-zinc-800">
          <div className="max-h-[600px] overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white dark:bg-zinc-900">
                <TableRow>
                  <TableHead className="w-24">Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : leaderboardData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      No data available
                    </TableCell>
                  </TableRow>
                ) : (
                  leaderboardData.map((entry) => (
                    <TableRow key={entry.username} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <TableCell className="font-medium">
                        {entry.rank === 1 && "🥇"}
                        {entry.rank === 2 && "🥈"}
                        {entry.rank === 3 && "🥉"}
                        {entry.rank > 3 && `#${entry.rank}`}
                      </TableCell>
                      <TableCell>{entry.username}</TableCell>
                      <TableCell className="text-right font-medium">{entry.totalPoints}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )

}
