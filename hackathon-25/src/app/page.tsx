"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:flex-1 bg-zinc-900 text-white p-12 relative flex-col justify-between">
        <div>
          <Link href="/" className="text-xl font-bold">
            MoneyMind
          </Link>
        </div>
        <div className="max-w-md">
          <blockquote className="text-lg font-medium mb-4">
            "An investment in knowledge pays the best interest."
          </blockquote>
          <cite className="text-zinc-400">Benjamin Franklin</cite>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-zinc-950">
        <div className="max-w-sm w-full">
          <h1 className="text-2xl font-semibold tracking-tight mb-8">Welcome back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Username
              </label>
              <Input
                id="username"
                placeholder="Enter your username"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <Input id="password" placeholder="Enter your password" type="password" autoComplete="current-password" />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}