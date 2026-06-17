"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Clock, Plus, Trash2, Edit2, ToggleLeft as Toggle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { userReminders } from "@/lib/data"

export default function RemindersPage() {
  const [reminders, setReminders] = useState(userReminders)
  const [showForm, setShowForm] = useState(false)

  const toggleReminder = (id: string) => {
    setReminders(reminders.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)))
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <Link href="/user/dashboard" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Medicine Reminders</h1>
              <p className="text-muted-foreground mt-1">Never miss a dose with smart reminders</p>
            </div>
            <Button className="gap-2" onClick={() => setShowForm(!showForm)}>
              <Plus className="w-4 h-4" />
              Add Reminder
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Add Reminder Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Create New Reminder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medicine Name</label>
                  <input
                    type="text"
                    placeholder="Enter medicine name"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dosage</label>
                  <input
                    type="text"
                    placeholder="e.g., 500mg"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-border bg-background">
                    <option>Once daily</option>
                    <option>Twice daily</option>
                    <option>Three times daily</option>
                    <option>As needed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Notification Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background"
                    defaultValue="08:00"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => setShowForm(false)}>
                  Save Reminder
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reminders List */}
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{reminder.medicineName}</h3>
                    <div className="grid md:grid-cols-3 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Dosage</p>
                        <p className="text-sm font-medium">{reminder.dosage}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Frequency</p>
                        <p className="text-sm font-medium">{reminder.frequency}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Next Due</p>
                        <p className="text-sm font-medium">{reminder.nextDue}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => toggleReminder(reminder.id)}
                      className={`p-2 rounded-lg transition-colors ${reminder.enabled ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                    >
                      <Toggle2 className="w-5 h-5" />
                    </button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {reminders.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No reminders set yet</p>
              <Button className="mt-4" onClick={() => setShowForm(true)}>
                Create Your First Reminder
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
