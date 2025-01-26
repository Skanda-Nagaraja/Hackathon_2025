"use client"
import React from 'react';

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useUser } from "../../contexts/UserContext"
import Cookies from "js-cookie";
//import { cookies } from "next/headers"

export default function LoginPage() {
  const router = useRouter();
  // Accessed setUser from useUser to set the logged-in user's data after a successful login
  const { setUser } = useUser();

  // State management for form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Added handleChange to update form state
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Make API request to the login endpoint
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log(data)
      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      Cookies.set("token", data.token, { expires: 1 / 144 });
      // Set user data in the UserContext after successful login
      setUser({
        id: data.user.id,
        username: data.user.username,  // Make sure this is being set
        points: data.user.totalPoints
      });
      console.log(data.user)
      // Redirect to the dashboard after successful login
      router.push("/dashboard");
    } catch (error) {
      // Set error message if login fails
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      // Stop loading after the API call is finished
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-pink-200 dark:bg-zinc-900">
        <div className="max-w-sm w-full">
          <Link href="/" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 block font-orbitron">
            MoneyMind 
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight mb-8 text-zinc-900 dark:text-zinc-100">Welcome back</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-500 bg-red-100 dark:bg-red-900/20 rounded-md">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
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
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-900 dark:text-zinc-100"
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
                Don`&apos;`t have an account?{" "}
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
          `&quot;`An investment in knowledge pays the best interest.`&quot;`
            <footer className="mt-2 text-sm text-zinc-300">Benjamin Franklin</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}