"use client"

import Link from "next/link"
import { ChevronLeft, User, MapPin, Phone, Mail, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export default function ProfilePage() {
  const { user: currentUser, logout, loading } = useAuth()

  if (loading) return null
  if (!currentUser) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/user/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{currentUser.name}</p>
                  <p className="text-sm text-muted-foreground">Customer</p>
                </div>
              </div>
              <Button className="gap-2">
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Phone
                </p>
                <p className="font-medium">{currentUser.phone}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </p>
                <p className="font-medium">{currentUser.location?.address}</p>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-4">Account Preferences</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Receive dosage reminders</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Receive order updates</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span className="text-sm">Receive promotional offers</span>
                </label>
              </div>
            </div>

            <div className="border-t border-border pt-6 flex gap-2">
              <Button variant="outline" className="flex-1 bg-transparent">
                Change Password
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent text-destructive border-destructive/20">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
