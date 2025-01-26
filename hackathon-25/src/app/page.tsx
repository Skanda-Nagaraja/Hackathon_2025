"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-zinc-900">
        <div className="max-w-sm w-full">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 block">
            MoneyMind
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mb-8 text-zinc-900 dark:text-zinc-100">Welcome back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
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

      {/* Right side - Image background */}
      <div className="hidden lg:block lg:flex-1 relative">
        <Image
          src="/images/background.jpg"
          alt="Financial literacy concept"
          layout="fill"
          objectFit="cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end p-12">
          <blockquote className="text-lg font-medium text-white max-w-lg">
            "An investment in knowledge pays the best interest."
            <footer className="mt-2 text-sm text-zinc-300">Benjamin Franklin</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

