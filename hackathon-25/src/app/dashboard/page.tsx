"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import ModeToggle from "@/components/mode-toggle";
import { Trophy, User, Wallet, TrendingUp, CreditCard, PiggyBank, Receipt, LineChart, Home, Shield } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserProvider, useUser } from "../UserContext"
import { useEffect } from "react";

import { useRouter } from "next/navigation";

const categories = [
    { name: "Budgeting", icon: Wallet },
    { name: "Investments", icon: TrendingUp },
    { name: "Credit & Loans", icon: CreditCard },
    { name: "Savings", icon: PiggyBank },
    { name: "Taxes", icon: Receipt },
    { name: "Retirement Planning", icon: LineChart },
    { name: "Housing and Rent", icon: Home },
    { name: "Insurance", icon: Shield },
];

export default function DashboardPage() {
    const { user, logout } = useUser(); // Get the user and logout function from UserContext
    console.log(user)
    const router = useRouter();
  
    useEffect(() => {
      if (!user) {
        router.push("/login"); // Redirect to login if the user is not authenticated
      }
    }, [user, router]);
  
    if (!user) return null;

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
            {/* Header */}
            <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-100">
                        <Trophy className="w-5 h-5" />
                        <span className="font-medium">{user.points } points</span>
                    </div>

                    <Link href="/leaderboard">
                        <Button variant="ghost" className="text-zinc-900 dark:text-zinc-100">
                            <Trophy className="w-5 h-5 mr-2" />
                            Leaderboard
                        </Button>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="text-zinc-900 dark:text-zinc-100">
                                    <User className="w-5 h-5 mr-2" />
                                    {user?.username }
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                    <Link href="/user-dashboard">User Dashboard</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <ModeToggle />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
                <div className="max-w-5xl w-full">
                    <h1 className="text-3xl font-bold text-center mb-12 text-zinc-900 dark:text-zinc-100">
                        Financial Literacy Challenge
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {categories.map((category, index) => (
                            <Link
                                href={`/problem/${encodeURIComponent(category.name)}`}
                                key={index}
                                className="h-full"
                            >
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
            </main>
        </div>
    );
}