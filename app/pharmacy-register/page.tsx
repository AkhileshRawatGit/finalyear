"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Pill, Store, MapPin } from "lucide-react"

export default function PharmacyRegisterPage() {
  const router = useRouter()
  const { data: session, status, update } = useSession()
  
  const [formData, setFormData] = useState({
    pharmacyName: "",
    address: "",
    city: "",
    license: "",
    phone: "",
    deliveryAvailable: false,
    latitude: null as number | null,
    longitude: null as number | null,
  })
  
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?redirect=/pharmacy-register")
    }
    // If they already are a pharmacy, push them to dashboard
    if (status === "authenticated" && (session?.user as any)?.userType === "pharmacy") {
      router.push("/pharmacy-dashboard")
    }
  }, [status, router, session])

  if (status === "loading") {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Double check so page doesn't glitch while redirecting
  if (status === "unauthenticated" || (session?.user as any)?.userType === "pharmacy") {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("")

    if (!formData.pharmacyName || !formData.address || !formData.city || !formData.phone) {
      setError("Please fill all required fields")
      return
    }

    setIsSubmitting(true)
    try {
      const userId = (session?.user as any)?.id;
      const res = await fetch("/api/pharmacy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: formData.pharmacyName,
          email: session?.user?.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          license: formData.license,
          deliveryAvailable: formData.deliveryAvailable,
          latitude: formData.latitude,
          longitude: formData.longitude
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Registration failed")

      // Update NextAuth session to reflect the new userType (pharmacy)
      await update({ userType: "pharmacy" });

      router.push("/pharmacy-dashboard")
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3">
          <div className="flex items-center gap-2 justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Store className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">MedAccess</span>
          </div>
          <CardTitle className="text-center">Register Your Pharmacy Component</CardTitle>
          <CardDescription className="text-center">
            Link your pharmacy profile to {session?.user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Pharmacy Name *</label>
              <input
                type="text"
                name="pharmacyName"
                value={formData.pharmacyName}
                onChange={handleChange}
                placeholder="e.g. Apollo Pharmacy"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91-9876543210"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Store Address *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address or Locality"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Rishikesh"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Auto Location</label>
                <Button 
                  type="button" 
                  variant="outline" 
                   className="w-full h-10 bg-transparent flex items-center justify-center gap-2 border-primary/20 text-primary"
                  onClick={() => {
                    if ("geolocation" in navigator) {
                      navigator.geolocation.getCurrentPosition((pos) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          latitude: pos.coords.latitude, 
                          longitude: pos.coords.longitude 
                        }))
                        alert("Location captured! You can fine-tune this in your dashboard later.")
                      })
                    }
                  }}
                >
                  <MapPin className="w-4 h-4" />
                  {formData.latitude ? "📍 Set" : "Capture"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">License (Optional)</label>
              <input
                type="text"
                name="license"
                value={formData.license}
                onChange={handleChange}
                placeholder="DLC XXXXX"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background"
              />
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg border border-border mt-4">
              <input
                type="checkbox"
                name="deliveryAvailable"
                checked={formData.deliveryAvailable}
                onChange={handleChange}
                id="delivery"
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="delivery" className="text-sm font-medium cursor-pointer">
                Enable Home Delivery Service
              </label>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
              {isSubmitting ? "Registering..." : "Complete Registration"}
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding, you agree to our Terms of Service for Pharmacy Partners.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
