"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { ChevronLeft, FileText, AlertCircle, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Logo } from "@/components/Logo"
import { NotificationBell } from "@/components/NotificationBell"

function CheckoutContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user: currentUser, logout } = useAuth()
  const pharmacyId = searchParams.get('pharmacy') || "pharm-001"

  const [cart, setCart] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [prescriptionRequired, setPrescriptionRequired] = useState(false)
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null)
  const [deliveryType, setDeliveryType] = useState<"pickup" | "delivery">("delivery")
  const [step, setStep] = useState<"cart" | "prescription" | "payment">("cart")

  useEffect(() => {
    const fetchMedicine = async () => {
      const medId = searchParams.get('medicine')
      const qty = parseInt(searchParams.get('quantity') || '1')

      if (!medId) {
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/api/medicines?id=${medId}`)
        if (res.ok) {
          const med = await res.json()
          setCart([{
            medicineId: med.id,
            name: med.name,
            quantity: qty,
            price: med.price
          }])
          setPrescriptionRequired(med.requiresPrescription || false)
        }
      } catch (err) {
        console.error("Failed to fetch medicine for checkout:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchMedicine()
  }, [searchParams])

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleProceed = () => {
    if (prescriptionRequired && !prescriptionFile) {
      alert("Please upload a prescription")
      return
    }
    setStep("payment")
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOrder = async () => {
    if (!currentUser) {
      alert("Please log in to place an order.")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        userId: currentUser.id,
        pharmacyId: pharmacyId,
        medicines: cart,
        totalPrice: deliveryType === "pickup" ? totalPrice : totalPrice + 50,
        deliveryType: deliveryType
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error('Failed to place order')
      }

      alert("Order placed successfully! The pharmacy has been notified instantly.")
      router.push("/user/dashboard")
    } catch (error) {
      console.error(error)
      alert("There was an error placing your order.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            {currentUser && <NotificationBell />}
            <Link href="/user/dashboard">
              <Button variant="ghost" size="sm" className="font-medium">Dashboard</Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/') }} className="text-destructive font-medium border border-transparent hover:border-destructive/20 hover:bg-destructive/5 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex justify-between mb-8 gap-4">
          {["cart", "prescription", "payment"].map((s) => (
            <div
              key={s}
              className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-colors ${step === s ? "border-primary bg-primary/5" : "border-border"
                }`}
            >
              <span className="font-medium capitalize text-sm">{s}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            {loading ? (
              <div className="flex justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : cart.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Your cart is empty</p>
                  <Link href="/search"><Button className="mt-4">Back to Search</Button></Link>
                </CardContent>
              </Card>
            ) : step === "cart" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.medicineId} className="p-3 rounded-lg border border-border flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium text-lg text-primary">{item.name || "Medicine Name"}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => setCart(cart.map(i => i.medicineId === item.medicineId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i))}
                          >
                            -
                          </Button>
                          <span className="font-bold w-4 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => setCart(cart.map(i => i.medicineId === item.medicineId ? { ...i, quantity: i.quantity + 1 } : i))}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-xl text-primary">₹{item.price * item.quantity}</p>
                        <p className="text-xs text-muted-foreground">₹{item.price} each</p>
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex justify-between font-medium">
                      <span>Subtotal</span>
                      <span>₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Delivery Charge</span>
                      <span>{deliveryType === "pickup" ? "Free" : "₹50"}</span>
                    </div>

                    <h4 className="font-medium mt-6 mb-3">Delivery Method</h4>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary">
                        <input
                          type="radio"
                          name="delivery"
                          value="pickup"
                          checked={deliveryType === "pickup"}
                          onChange={(e) => setDeliveryType(e.target.value as "pickup")}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Pickup from Pharmacy</span>
                      </label>
                      <label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary">
                        <input
                          type="radio"
                          name="delivery"
                          value="delivery"
                          checked={deliveryType === "delivery"}
                          onChange={(e) => setDeliveryType(e.target.value as "delivery")}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Home Delivery (+₹50)</span>
                      </label>
                    </div>
                  </div>

                  <Button className="w-full" onClick={() => setStep("prescription")}>
                    Continue
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "prescription" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Prescription Upload
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/20 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium">Some medicines require a valid prescription</p>
                      <p className="text-muted-foreground">
                        You can upload a digital prescription or get one from your doctor
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prescriptionRequired}
                        onChange={(e) => setPrescriptionRequired(e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">I have a prescription to upload</span>
                    </label>

                    {prescriptionRequired && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Upload Prescription</label>
                        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => setPrescriptionFile(e.target.files?.[0] || null)}
                            className="hidden"
                            id="prescription-upload"
                          />
                          <label htmlFor="prescription-upload" className="cursor-pointer">
                            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                            <p className="text-xs text-muted-foreground">PDF, PNG, JPG up to 5MB</p>
                            {prescriptionFile && <p className="text-xs text-primary mt-2">{prescriptionFile.name}</p>}
                          </label>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("cart")}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={handleProceed}>
                      Continue to Payment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "payment" && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {[
                      { id: "card", name: "Credit/Debit Card" },
                      { id: "upi", name: "UPI Payment" },
                      { id: "cod", name: "Cash on Delivery" },
                    ].map((method) => (
                      <label
                        key={method.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:border-primary"
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          defaultChecked={method.id === "upi"}
                          className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">{method.name}</span>
                      </label>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setStep("prescription")}>
                      Back
                    </Button>
                    <Button className="flex-1" onClick={handleOrder} disabled={isSubmitting}>
                      {isSubmitting ? "Processing..." : "Place Order"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-base">Order Total</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{deliveryType === "pickup" ? "Free" : "₹50"}</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{deliveryType === "pickup" ? totalPrice : totalPrice + 50}</span>
                </div>

                <div className="pt-3 text-xs text-muted-foreground space-y-1">
                  <p>✓ Secure checkout</p>
                  <p>✓ Same-day delivery available</p>
                  <p>✓ Money-back guarantee</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <CheckoutContent />
    </Suspense>
  )
}
