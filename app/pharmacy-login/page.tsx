"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

export default function PharmacyLoginPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect if already logged in as pharmacy/admin
  useEffect(() => {
    if (!loading && user && (user.userType === "pharmacy" || user.userType === "admin")) {
      router.push("/pharmacy-dashboard")
    }
  }, [user, loading, router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    try {
      // For pharmacy login, we want the api to check their role, or we can check it after sign in
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })
      
      if (res?.error) {
        throw new Error(res.error)
      }

      // Instead of manual fetch, we ask the server for our session to check the role
      const sessionRes = await fetch("/api/auth/session")
      const session = await sessionRes.json()

      if (session?.user?.userType !== "pharmacy" && session?.user?.userType !== "admin") {
        // If they are not a pharmacy, sign them out and show error
        await fetch("/api/auth/signout", { method: "POST" })
        throw new Error("Access denied. Pharmacy account required.")
      }

      // Use window.location.href to force a full reload and update NextAuth context immediately
      window.location.href = "/pharmacy-dashboard"
    } catch (err: any) {
      setError(err.message || "Failed to log in")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Pill className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">MedAccess</span>
          </div>
          <CardTitle className="text-center">Pharmacy Login</CardTitle>
          <CardDescription className="text-center">Access your pharmacy dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@pharmacy.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/pharmacy-register" className="text-primary font-medium hover:underline">
                Register your pharmacy
              </Link>
            </p>
            <p className="text-center text-sm text-muted-foreground">
              Are you a user?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
