"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Trophy, User, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserProvider, useUser } from "../UserContext"

import  ModeToggle  from "@/components/mode-toggle"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"


// Mock data for the leaderboard
const leaderboardData = [
  { rank: 1, username: "FinancePro", points: 15420 },
  { rank: 2, username: "InvestorGuru", points: 14250 },
  { rank: 3, username: "MoneyMaster", points: 13890 },
  { rank: 4, username: "SavingsKing", points: 12760 },
  { rank: 5, username: "BudgetQueen", points: 11980 },
  { rank: 6, username: "StockTrader", points: 11540 },
  { rank: 7, username: "WealthBuilder", points: 10890 },
  { rank: 8, username: "CryptoWhiz", points: 10450 },
  { rank: 9, username: "RetirementPro", points: 9870 },
  { rank: 10, username: "TaxExpert", points: 9340 },
  { rank: 11, username: "RealEstateGuru", points: 8920 },
  { rank: 12, username: "InsurancePro", points: 8450 },
  { rank: 13, username: "DebtSlayer", points: 8120 },
  { rank: 14, username: "DividendKing", points: 7890 },
  { rank: 15, username: "BondTrader", points: 7560 },
]

export default function LeaderboardPage() {
  const router = useRouter()
  const { user } = useUser()

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
            <span className="font-medium">1,234 points</span>
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
                {leaderboardData.map((entry) => (
                  <TableRow key={entry.rank} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                    <TableCell className="font-medium">
                      {entry.rank === 1 && "🥇"}
                      {entry.rank === 2 && "🥈"}
                      {entry.rank === 3 && "🥉"}
                      {entry.rank > 3 && `#${entry.rank}`}
                    </TableCell>
                    <TableCell>{entry.username}</TableCell>
                    <TableCell className="text-right font-medium">{entry.points.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  )
}

