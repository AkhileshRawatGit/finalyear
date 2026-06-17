"use client"

import { AlertTriangle, ChevronRight, CheckCircle, XCircle, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// Sample dispute data
const disputes = [
  {
    id: "dispute-001",
    orderId: "order-123",
    customerName: "Rajesh Kumar",
    pharmacyName: "MediCare Plus",
    issue: "Medicine expired before delivery",
    status: "open",
    createdAt: "2025-12-05",
  },
  {
    id: "dispute-002",
    orderId: "order-456",
    customerName: "Priya Singh",
    pharmacyName: "QuickPharma",
    issue: "Wrong medicine delivered",
    status: "in_review",
    createdAt: "2025-12-04",
  },
  {
    id: "dispute-003",
    orderId: "order-789",
    customerName: "Amit Patel",
    pharmacyName: "HealthHub",
    issue: "Payment not received",
    status: "resolved",
    createdAt: "2025-12-03",
  },
]

export default function DisputesPage() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4 text-accent" />
      case "in_review":
        return <AlertTriangle className="w-4 h-4 text-accent" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-accent/10 text-accent"
      case "in_review":
        return "bg-accent/10 text-accent"
      case "resolved":
        return "bg-green-100 text-green-700"
      case "rejected":
        return "bg-destructive/10 text-destructive"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">Dispute Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Review and resolve customer-pharmacy disputes</p>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Filter Buttons */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {["all", "open", "in_review", "resolved", "rejected"].map((filter) => (
            <Button key={filter} variant="outline" size="sm" className="bg-transparent capitalize">
              {filter === "all" ? "All Disputes" : filter.replace("_", " ")}
            </Button>
          ))}
        </div>

        {/* Disputes List */}
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id} className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">Order #{dispute.orderId}</h3>
                      {getStatusIcon(dispute.status)}
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded capitalize ${getStatusColor(dispute.status)}`}
                      >
                        {dispute.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3 text-sm">
                      <div>
                        <p className="text-muted-foreground text-xs">Customer</p>
                        <p className="font-medium">{dispute.customerName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Pharmacy</p>
                        <p className="font-medium">{dispute.pharmacyName}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Reported</p>
                        <p className="font-medium">{dispute.createdAt}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      <span className="font-medium">Issue:</span> {dispute.issue}
                    </p>
                  </div>

                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    Review
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
