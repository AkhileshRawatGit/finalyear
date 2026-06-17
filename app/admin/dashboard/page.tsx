"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, AlertTriangle, Store, Users, ShoppingBag, Activity, CheckCircle, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

// Sample admin data
const systemMetrics = [
  { date: "Day 1", pharmacies: 45, users: 1200, orders: 340 },
  { date: "Day 2", pharmacies: 47, users: 1350, orders: 380 },
  { date: "Day 3", pharmacies: 50, users: 1550, orders: 420 },
  { date: "Day 4", pharmacies: 52, users: 1680, orders: 460 },
  { date: "Day 5", pharmacies: 55, users: 1850, orders: 510 },
  { date: "Day 6", pharmacies: 58, users: 2100, orders: 580 },
]

const disputeData = [
  { name: "Resolved", value: 145, color: "#22c55e" },
  { name: "Pending", value: 32, color: "#f59e0b" },
  { name: "Rejected", value: 18, color: "#ef4444" },
]

export default function AdminDashboard() {
  const { logout } = useAuth()
  const router = useRouter()
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo showTagline={false} />
            <div className="h-8 w-px bg-border hidden sm:block" />
            <h1 className="text-lg font-bold text-gray-900 hidden sm:block">Admin Panel</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="font-medium">Reports</Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => { logout(); router.push('/') }} className="text-destructive font-medium border border-transparent hover:border-destructive/20 hover:bg-destructive/5 transition-all">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">System Dashboard</h1>
          <p className="text-muted-foreground">Monitor platform health, disputes, and analytics</p>
        </div>

        {/* KPI Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-muted-foreground">Total Pharmacies</p>
                <Store className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">2,547</p>
              <p className="text-xs text-green-600 mt-2">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">125.3K</p>
              <p className="text-xs text-green-600 mt-2">+8.2% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <ShoppingBag className="w-4 h-4 text-primary" />
              </div>
              <p className="text-2xl font-bold">78,420</p>
              <p className="text-xs text-green-600 mt-2">98.5% success rate</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-2">
                <p className="text-sm text-muted-foreground">Open Disputes</p>
                <AlertTriangle className="w-4 h-4 text-destructive" />
              </div>
              <p className="text-2xl font-bold">32</p>
              <p className="text-xs text-destructive mt-2">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* System Growth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  System Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    pharmacies: { label: "Pharmacies", color: "hsl(var(--chart-1))" },
                    users: { label: "Users (100s)", color: "hsl(var(--chart-2))" },
                    orders: { label: "Orders (10s)", color: "hsl(var(--chart-3))" },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={systemMetrics} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="pharmacies" stroke="hsl(var(--chart-1))" />
                      <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2))" />
                      <Line type="monotone" dataKey="orders" stroke="hsl(var(--chart-3))" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Dispute Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Dispute Resolution Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={{}} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={disputeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {disputeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Store className="w-4 h-4 mr-2" />
                  Manage Pharmacies
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Review Disputes
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  <Activity className="w-4 h-4 mr-2" />
                  System Health
                </Button>
              </CardContent>
            </Card>

            {/* Critical Alerts */}
            <Card className="border-destructive/20">
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Critical Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="p-2 rounded bg-destructive/5 border border-destructive/10">
                  <p className="font-medium">High Error Rate Detected</p>
                  <p className="text-xs text-destructive mt-1">Payment gateway showing 2.3% failures</p>
                </div>
                <div className="p-2 rounded bg-accent/5 border border-accent/10">
                  <p className="font-medium">Pending Approvals</p>
                  <p className="text-xs text-accent mt-1">5 new pharmacies awaiting verification</p>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>API Status</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Healthy
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Operational
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cache Server</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Running
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
