"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

export default function LoginPage() {
  const router = useRouter();

  // State management for the form
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push("/dashboard");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  
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
          <h1 className="text-2xl font-semibold tracking-tight mb-8 text-center text-white">Welcome back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none text-zinc-600 dark:text-zinc-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Username
              </label>
              <Input
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                type="text"
                autoCapitalize="none"
                autoComplete="username"
                autoCorrect="off"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium leading-none text-zinc-600 dark:text-zinc-400 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Password
              </label>
              <Input
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                type="password"
                autoComplete="current-password"
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
            <div className="mt-4 text-center">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Don't have an account?{" "}
                <Link href="/register">
                  <Button variant="link" className="p-0 h-auto font-semibold text-blue-500">
                    Sign Up
                  </Button>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );  
}