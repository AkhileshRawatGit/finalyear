"use client"

import Link from "next/link"
import { ChevronLeft, Heart, FileText, Calendar, Users, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { userDigitalRecords } from "@/lib/data"

export default function MedicalRecordsPage() {
  const recordTypes = [
    { type: "prescription", icon: FileText, label: "Prescription" },
    { type: "test_report", icon: FileText, label: "Test Report" },
    { type: "vaccination", icon: Calendar, label: "Vaccination" },
    { type: "allergy", icon: AlertCircle, label: "Allergy Info" },
    { type: "diagnosis", icon: Heart, label: "Diagnosis" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link href="/user/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground mt-1">Securely store and manage your health documents</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Add Record */}
        <Card className="mb-8 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-4">Add New Record</h3>
            <div className="grid md:grid-cols-5 gap-3">
              {recordTypes.map((record) => {
                const Icon = record.icon
                return (
                  <Button
                    key={record.type}
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center gap-2 bg-background"
                  >
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-xs text-center">{record.label}</span>
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Records List */}
        <div className="grid md:grid-cols-2 gap-6">
          {userDigitalRecords.map((record) => (
            <Card key={record.id} className="hover:border-primary transition-colors">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{record.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary capitalize font-medium">
                    {record.recordType.replace("_", " ")}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-4">{record.details}</p>

                {record.doctorName && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                    <Users className="w-4 h-4" />
                    {record.doctorName}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Download
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
