"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileStats from "@/components/ui/ProfileStats";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, GamepadIcon } from "lucide-react";
import { useUser } from "../UserContext";

export default function UserDashboardPage() {
    const { user, logout } = useUser() as {
        user: { username: string } | null; // Minimal user data from context
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

    // Show loading spinner or message while fetching data
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading user data...</p>
            </div>
        );
    }

    // Show an error message if fetching fails
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>{error}</p>
            </div>
        );
    }

    // Show a fallback state for guests (optional)
    if (!user && !userData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Please log in to view your dashboard.</p>
                <Button onClick={() => router.push("/login")}>Go to Login</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col p-8">
            {/* Navigation Buttons */}
            <div className="max-w-4xl mx-auto w-full mb-8 flex flex-wrap gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.push("/dashboard")}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Button>

                <Button
                    variant="outline"
                    onClick={() => router.push("/")}
                    className="flex items-center gap-2"
                >
                    <Home className="h-4 w-4" />
                    Home
                </Button>

                <Button
                    variant="outline"
                    onClick={() => router.push("/problem/random")}
                    className="flex items-center gap-2"
                >
                    <GamepadIcon className="h-4 w-4" />
                    Play Game
                </Button>
            </div>

            <h1 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-100">
                User Dashboard
            </h1>

            {/* Pass the fetched user data to ProfileStats */}
            {userData ? <ProfileStats userData={userData} /> : <p>No data available.</p>}
        </div>
    );
}