"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"; // Added Tooltip and Legend
import { ArrowLeft, LogOut, Trophy } from "lucide-react";
import { useUser } from "../../contexts/UserContext";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function UserDashboard() {
    const { user, logout } = useUser() as {
        user: { username: string } | null;
        logout: () => void;
    };

    const router = useRouter();

    // State to store fetched user data
    const [userData, setUserData] = useState<{
        _id: string;
        username: string;
        totalGamesPlayed: number;
        totalWins: number;
        categoryStats: { [category: string]: any };
        gameHistory: {
            category: string;
            question: string;
            choices: string[];
            chosenOption: string;
            isCorrect: boolean;
            playedAt: string;
            _id: string;
        }[];
        createdAt: Date;
        updatedAt: Date;
        __v: number;
        totalPoints: number;
    } | null>(null);

    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state

    // Derived states for UI
    const [userStats, setUserStats] = useState({
        totalGames: 0,
        totalWins: 0,
        winRate: 0,
        rank: 0,
    });
    const [problemHistory, setProblemHistory] = useState<any[]>([]);
    const [categoryData, setCategoryData] = useState<any[]>([]);

    // 1. Fetch the user’s own data (games played, points, etc.)
    useEffect(() => {
        // Fetch user data from the API
        async function fetchUserData(username: string) {
            try {
                const response = await fetch(`/api/users/${username}/stats`, {
                    method: "GET",
                });
                if (!response.ok) {
                    console.log(response);
                    throw new Error("Failed to fetch user data");
                }
                const data = await response.json();
                setUserData(data); // Set the fetched user data

                // Derive stats
                setUserStats((prev) => ({
                    ...prev,
                    totalGames: data.totalGamesPlayed,
                    totalWins: data.totalWins,
                    winRate: data.totalGamesPlayed
                        ? Math.round((data.totalWins / data.totalGamesPlayed) * 100)
                        : 0,
                    // We'll update rank separately in the second useEffect
                }));

                // Process problem history
                const history = data.gameHistory.map((game: any) => ({
                    id: game._id,
                    category: game.category,
                    correct: game.isCorrect,
                }));
                setProblemHistory(history);

                // Process category data for pie chart
                const categories = Object.keys(data.categoryStats);
                const catData = categories.map((category) => ({
                    name: category,
                    value: data.categoryStats[category]?.gamesPlayed || 0, // Use 'gamesPlayed'
                }));
                console.log("Category Data for PieChart:", catData); // Debugging
                setCategoryData(catData);
            } catch (error) {
                console.error("Error fetching user data:", error);
                setError("Failed to fetch user data. Please try again.");
            } finally {
                setLoading(false); // End loading state
            }
        }

        if (user?.username) {
            // If user exists in the context, fetch their data
            fetchUserData(user.username);
        } else {
            // If no user in context, display a guest state or message
            setLoading(false);
        }
    }, [user]);

    // 2. Fetch leaderboard separately to find the rank of the logged-in user
    useEffect(() => {
        // Only fetch if we have a valid username
        if (!user?.username) return;

        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("/api/leaderboard");
                if (!response.ok) {
                    throw new Error("Failed to fetch leaderboard");
                }
                const data = await response.json();

                // Sort descending by totalPoints
                const sorted = data.sort(
                    (a: any, b: any) => b.totalPoints - a.totalPoints
                );

                // Find the index of our current user
                const indexOfUser = sorted.findIndex(
                    (item: any) => item.username === user.username
                );

                // If the user is found, update the rank in our userStats
                if (indexOfUser !== -1) {
                    const rank = indexOfUser + 1;
                    setUserStats((prev) => ({
                        ...prev,
                        rank: rank,
                    }));
                }
            } catch (error) {
                console.error("Error fetching leaderboard:", error);
            }
        };

        fetchLeaderboard();
    }, [user]);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/login");
        } catch (error) {
            console.error("Error during logout:", error);
            // Optionally handle logout errors
        }
    };

    // Show loading spinner or message while fetching data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="text-xl">Loading user data...</p>
            </div>
        );
    }

    // Show an error message if fetching fails
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="text-xl text-red-500">{error}</p>
            </div>
        );
    }

    // Show a fallback state for guests (optional)
    if (!user && !userData) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-8">
                <p className="mb-4 text-xl">Please log in to view your dashboard.</p>
                <Button onClick={() => router.push("/login")} className="flex items-center gap-2">
                    Go to Login
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Navigation Buttons */}
                <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push("/dashboard")}
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Button>
                    </div>

                    <Button
                        variant="destructive"
                        onClick={handleLogout}
                        className="flex items-center gap-2"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>

                <h1 className="text-4xl font-bold text-center text-zinc-900 dark:text-zinc-100">
                    Hello, {userData?.username || "Guest"}
                </h1>

                <div className="grid gap-8 md:grid-cols-2">
                    <Card>
                        <CardContent className="flex items-center justify-center p-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                                    Total Points
                                </h2>
                                <p className="text-6xl font-bold text-amber-500">
                                    {userData?.totalPoints || 0}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                        Total Games
                                    </h3>
                                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {userStats.totalGames}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                        Total Wins
                                    </h3>
                                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {userStats.totalWins}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                        Win Rate
                                    </h3>
                                    <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                                        {userStats.winRate}%
                                    </p>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300">
                                        Rank
                                    </h3>
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
                                        {problemHistory.length > 0 ? (
                                            problemHistory.map((problem) => (
                                                <TableRow key={problem.id}>
                                                    <TableCell>{problem.category}</TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={
                                                                problem.correct
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }
                                                        >
                                                            {problem.correct ? "Correct" : "Incorrect"}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={2} className="text-center">
                                                    No problem history available.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Category Performance</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[200px] overflow-auto"> {/* Increased height for better visibility */}
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
                                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip /> {/* Added Tooltip */}
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 flex flex-wrap justify-center gap-4">
                                    {categoryData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center">
                                            <div
                                                className="w-3 h-3 mr-2"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[index % COLORS.length],
                                                }}
                                            ></div>
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
                                    Based on your performance, we recommend focusing more on
                                    Investments and Taxes. Try to allocate more time to these
                                    categories to improve your overall financial literacy.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}