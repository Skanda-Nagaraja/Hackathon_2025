"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ModeToggle from "@/components/mode-toggle"
import { Wallet, TrendingUp, CreditCard, PiggyBank, Receipt, LineChart, Home, Shield } from "lucide-react"

const categories = [
  { name: "Budgeting", icon: Wallet },
  { name: "Investments", icon: TrendingUp },
  { name: "Credit & Loans", icon: CreditCard },
  { name: "Savings", icon: PiggyBank },
  { name: "Taxes", icon: Receipt },
  { name: "Retirement Planning", icon: LineChart },
  { name: "Housing and Rent", icon: Home },
  { name: "Insurance", icon: Shield },
]

export default function ChallengePage() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-zinc-50 dark:bg-zinc-950">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <h1 className="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-100">
        Financial Literacy Challenge
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {categories.map((category, index) => (
          <Link href={`/problem/${encodeURIComponent(category.name)}`} key={index} className="h-full">
            <Button
              variant="outline"
              className="w-full h-full min-h-[200px] p-8 flex flex-col items-center justify-center gap-4 text-lg font-medium transition-all hover:scale-[1.02] hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:border-zinc-700"
            >
              <category.icon className="w-12 h-12" />
              {category.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  )
}