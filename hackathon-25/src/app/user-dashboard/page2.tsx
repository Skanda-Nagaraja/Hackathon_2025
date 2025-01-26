"use client"
import React from 'react';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProfileStats from '@/components/ui/ProfileStats'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, GamepadIcon } from 'lucide-react'
import { useUser } from "@/contexts/UserContext"


export default function UserDashboardPage() {
    const { user } = useUser() as { 
      user: {
        username: string;
        createdAt: Date;
        totalGamesPlayed: number;
        totalWins: number;
        categoryStats: Map<string, any>;
        gameHistory: any[];
      } | null;
      logout: () => void;
    }; // Get the user and logout function from UserContext
    const router = useRouter();
  
    useEffect(() => {
      if (!user) {
        router.push("/login"); // Redirect to login if the user is not authenticated
      }
    }, [user, router]);
  
    if (!user) return null; // Avoid rendering while redirecting
  

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col p-8">
      {/* Navigation Buttons */}
      <div className="max-w-4xl mx-auto w-full mb-8 flex flex-wrap gap-4">
        <Button
          variant="outline"
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Home
        </Button>

        <Button
          variant="outline"
          onClick={() => router.push('/problem/random')}
          className="flex items-center gap-2"
        >
          <GamepadIcon className="h-4 w-4" />
          Play Game
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-8 text-zinc-900 dark:text-zinc-100">
        User Dashboard
      </h1>

      <ProfileStats userData={user} />
    </div>
  )
};

