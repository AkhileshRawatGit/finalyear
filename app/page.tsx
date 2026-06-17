"use client"

import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  MapPin, Pill, Clock, Heart, AlertCircle, TrendingUp, Search, ShoppingBag, Bell,
  FileText, Shield, Smartphone, Zap, Mail, Phone, MessageSquare, BookOpen, HelpCircle, MessageCircle,
  ChevronDown, ChevronUp, Users, Award, LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { TypingAnimation } from "@/components/typing-animation"
import { useAuth } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Logo } from "@/components/Logo"
import { NotificationBell } from "@/components/NotificationBell"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LandingPage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    {
      question: "How do I search for medicines?",
      answer: "Simply enter the medicine name in the search bar on the homepage. You'll see real-time availability from nearby pharmacies within a 5 km radius. You can also filter by price, distance, and pharmacy ratings."
    },
    {
      question: "How accurate is the medicine availability information?",
      answer: "Our platform provides real-time stock updates from partner pharmacies. The information is updated every few minutes to ensure accuracy. However, we recommend calling the pharmacy before visiting for critical medicines."
    },
    {
      question: "Can I order medicines for home delivery?",
      answer: "Yes! Many of our partner pharmacies offer home delivery. When you search for a medicine, you'll see which pharmacies provide delivery services. Simply select the pharmacy and choose the delivery option during checkout."
    },
    {
      question: "How do medicine reminders work?",
      answer: "Set up reminders in the 'Reminders' section. You can specify the medicine name, dosage, frequency, and time. We'll send you notifications via email and in-app alerts to help you stay on track with your medication schedule."
    },
    {
      question: "Is my health data secure?",
      answer: "Absolutely. We use industry-standard encryption (256-bit SSL) to protect your data. Your prescriptions, medical records, and personal information are stored securely and never shared with third parties without your explicit consent."
    },
    {
      question: "How do I upload my prescription?",
      answer: "Go to your profile and select 'Health Records'. Click 'Upload Prescription' and choose an image or PDF file. You can also take a photo directly using your device's camera. All prescriptions are stored securely in your account."
    },
    {
      question: "What if my medicine is out of stock?",
      answer: "If a medicine is unavailable, our system will suggest alternative medicines with the same composition. You can also set up stock alerts to be notified when the medicine becomes available at nearby pharmacies."
    },
    {
      question: "How do I become a partner pharmacy?",
      answer: "We'd love to partner with you! Visit our 'For Pharmacies' page or contact our business team at business@medaccess.com. We'll guide you through the registration process and help you get started."
    },
    {
      question: "Are there any subscription fees?",
      answer: "MedAccess is free for users! You can search medicines, set reminders, and manage health records at no cost."
    },
    {
      question: "How do I cancel or modify an order?",
      answer: "Go to 'My Orders' in your account. If the order hasn't been processed yet, you'll see options to modify or cancel. For orders already in progress, please contact the pharmacy directly using the contact information provided."
    }
  ]

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <Logo />

            {/* Navigation Links */}
            <div className="hidden lg:flex items-center gap-8">
              <Link href="#features" className="text-base text-gray-700 hover:text-primary font-medium transition-colors">
                Features
              </Link>
              <Link href="/search" className="text-base text-gray-700 hover:text-primary font-medium transition-colors">
                Search
              </Link>
              <button
                onClick={() => {
                  if (!user) router.push('/login')
                  else router.push('/doctors')
                }}
                className="text-base text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Doctors
              </button>
              <Link
                href={user?.userType === 'pharmacy' || user?.userType === 'admin' ? "/pharmacy-dashboard" : "/pharmacy-login"}
                className="text-base text-gray-700 hover:text-primary font-medium transition-colors"
                suppressHydrationWarning
              >
                For Pharmacies
              </Link>
              <Link href="#about" className="text-base text-gray-700 hover:text-primary font-medium transition-colors">
                About
              </Link>
              <Link href="#contact" className="text-base text-gray-700 hover:text-primary font-medium transition-colors">
                Contact
              </Link>
              <Link href="#help" className="text-base text-gray-700 hover:text-primary font-medium transition-colors">
                Help
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/user/sos">
                <Button variant="destructive" size="default" className="hidden sm:inline-flex shadow-md hover:shadow-lg transition-all font-bold">
                  SOS
                </Button>
              </Link>

              <NotificationBell />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border border-primary/10">
                        <AvatarImage src={user.avatar || "/placeholder-user.jpg"} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 shadow-xl" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.userType === 'pharmacy' || user.userType === 'admin' ? (
                      <DropdownMenuItem asChild>
                        <Link href="/pharmacy-dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/user/dashboard">My Dashboard</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/user/profile">Profile Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/user/orders">My Orders</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => logout()} className="text-destructive focus:text-destructive">
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="default" className="hidden sm:inline-flex">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button size="default" className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Map Background */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Map Background Image */}
        <div
          className="absolute inset-0 bg-center"
          style={{
            backgroundImage: 'url(/map-background.png)',
            backgroundSize: '85%',
            zIndex: 0
          }}
        />

        {/* Light Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/30" style={{ zIndex: 1 }} />

        {/* Content */}
        <div className="container mx-auto px-4 relative max-w-4xl" style={{ zIndex: 10 }}>
          <div className="text-center mb-8">
            {/* Real-time Medicine Availability Badge */}
            <div className="inline-block px-4 py-2 rounded-full bg-green-100 border border-green-300 mb-6">
              <p className="text-sm font-medium text-green-700">Real-time Medicine Availability</p>
            </div>

            {/* Main Heading with Color and Typing Animation */}
            <h1 className="text-5xl md:text-7xl font-medium mb-4 leading-tight text-center">
              <TypingAnimation
                text="Find Medicines Near You, Instantly"
                speed={40}
                restartInterval={4000}
                className=""
              />
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
              Search medicines, find nearby pharmacies with real-time stock availability, manage your digital health
              records, and receive smart reminders for better health compliance.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for medicine..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white rounded-xl border-0 shadow-lg"
                suppressHydrationWarning
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && searchQuery) {
                    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
                  }
                }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
            <Button
              size="lg"
              className="flex-1 bg-white text-primary hover:bg-gray-50 h-16 rounded-xl shadow-lg gap-3"
              onClick={() => {
                if (!user) router.push('/login')
                else router.push('/search')
              }}
              suppressHydrationWarning
            >
              <MapPin className="w-6 h-6" />
              <span className="text-lg font-semibold">Nearby Stores</span>
            </Button>

            <Button
              size="lg"
              className="flex-1 bg-white text-primary hover:bg-gray-50 h-16 rounded-xl shadow-lg gap-3"
              onClick={() => {
                if (!user) router.push('/login')
                else router.push('/user/checkout')
              }}
              suppressHydrationWarning
            >
              <ShoppingBag className="w-6 h-6" />
              <span className="text-lg font-semibold">Order Online</span>
            </Button>

            <Button
              size="lg"
              className="flex-1 bg-white text-primary hover:bg-gray-50 h-16 rounded-xl shadow-lg gap-3"
              onClick={() => {
                if (!user) router.push('/login')
                else router.push('/user/reminders')
              }}
              suppressHydrationWarning
            >
              <Bell className="w-6 h-6" />
              <span className="text-lg font-semibold">Pill Reminders</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-background scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>5 KM Radius Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Find medicines in nearby pharmacies within a 5 km radius. Get real-time stock status,
                  pricing, and directions to the nearest available pharmacy.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Smart Reminders</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Never miss a dose with personalized medication reminders. Set up dosage schedules,
                  refill alerts, and expiry notifications automatically.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Digital Health Records</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Securely store prescriptions, test reports, vaccinations, and medical history.
                  Access your health records anytime, anywhere.
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Pill className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Medicine Substitutes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Get alternative medicine suggestions with the same composition if your preferred
                  medicine is out of stock. Compare prices and availability.
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Online Ordering</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Order medicines online and get them delivered to your doorstep. Track your orders
                  in real-time and enjoy hassle-free checkout.
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <AlertCircle className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>SOS Emergency Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Emergency button to quickly locate nearby pharmacies and doctors for urgent situations.
                  Get instant access to critical healthcare services.
                </p>
              </CardContent>
            </Card>

            {/* Feature 7 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  For pharmacy owners: Track stock levels, sales trends, customer insights, and
                  manage inventory intelligently with data-driven decisions.
                </p>
              </CardContent>
            </Card>

            {/* Feature 8 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Prescription Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Upload prescriptions directly from your device or take photos. Our system automatically
                  extracts medicine information for quick ordering.
                </p>
              </CardContent>
            </Card>

            {/* Feature 9 */}
            <Card className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-primary" />
                </div>
                <CardTitle>Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Set up alerts for out-of-stock medicines. Get notified immediately when your
                  required medicine becomes available at nearby pharmacies.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Capabilities</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Bank-Grade Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  256-bit SSL encryption, HIPAA compliance, and multi-factor authentication to keep
                  your health data completely secure and private.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Mobile App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Access MedAccess on the go with our mobile apps for iOS and Android. Sync your
                  data across all devices seamlessly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Real-Time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lightning-fast search results with real-time stock updates. Our system refreshes
                  pharmacy inventory every few minutes for accuracy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Search for Medicine</h3>
                <p className="text-muted-foreground">
                  Enter the medicine name in the search bar. Our intelligent search suggests medicines
                  as you type and shows detailed information.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">View Nearby Pharmacies</h3>
                <p className="text-muted-foreground">
                  See a list of pharmacies within 5 km that have the medicine in stock. Compare prices,
                  ratings, and delivery options.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Order or Visit</h3>
                <p className="text-muted-foreground">
                  Choose to order online for home delivery or get directions to visit the pharmacy.
                  Upload prescription if required.
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xl flex-shrink-0">
                4
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Manage Your Health</h3>
                <p className="text-muted-foreground">
                  Set reminders, track your medication history, and store all health records securely
                  in your personal health vault.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10 scroll-mt-20">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 text-gray-900">About MedAccess</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-12">
            Your trusted healthcare companion for finding medicines, managing prescriptions,
            and staying on top of your health needs.
          </p>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <Card>
              <CardHeader>
                <Shield className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Trust & Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your health data is protected with industry-leading encryption and security measures.
                  We never share your personal information without consent.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Patient-Centric</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Every feature we build is designed with patients in mind. We listen to your feedback
                  and continuously improve to serve you better.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-10 h-10 text-primary mb-3" />
                <CardTitle>Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We strive for excellence in everything we do, from accurate medicine information
                  to reliable pharmacy partnerships and seamless user experience.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 -z-10" />
        <div className="container mx-auto max-w-4xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">2,500+</p>
              <p className="text-muted-foreground">Pharmacies</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">50,000+</p>
              <p className="text-muted-foreground">Medicines</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">100K+</p>
              <p className="text-muted-foreground">Active Users</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-primary mb-2">4.8</p>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 scroll-mt-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">General Inquiries:</p>
                <a href="mailto:support@medaccess.com" className="text-primary hover:underline font-medium">
                  support@medaccess.com
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle>Call Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Customer Support:</p>
                <a href="tel:+911234567890" className="text-primary hover:underline font-medium text-lg">
                  +91-1234-567-890
                </a>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <CardTitle>Visit Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">Head Office:</p>
                <p className="font-medium">
                  MedAccess Technologies Pvt. Ltd.<br />
                  Bangalore, Karnataka
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  <CardTitle>Send Us a Message</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name</label>
                      <Input type="text" placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address</label>
                      <Input type="email" placeholder="your.email@example.com" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subject</label>
                    <Input type="text" placeholder="How can we help you?" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Message</label>
                    <textarea
                      className="w-full min-h-32 rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                  <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Help / FAQ Section */}
      <section id="help" className="py-20 px-4 bg-gray-50 scroll-mt-20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          {/* Quick Help Categories */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <BookOpen className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Getting Started</CardTitle>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <HelpCircle className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Account & Settings</CardTitle>
              </CardHeader>
            </Card>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <MessageCircle className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Orders & Delivery</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                  {openFaq === index ? (
                    <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Health Journey?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of users managing their medications more effectively
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="gap-2"
              onClick={() => {
                if (!user) router.push('/signup')
                else router.push('/user/dashboard')
              }}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                if (!user) router.push('/login')
                else router.push('/search')
              }}
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">About</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>About Us</li>
                <li>Blog</li>
                <li>Careers</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Products</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/signup" className="hover:text-primary transition-colors">
                    For Users
                  </Link>
                </li>
                <li>
                  <Link href="/pharmacy-login" className="hover:text-primary transition-colors">
                    For Pharmacies
                  </Link>
                </li>
                <li>
                  <Link href="/admin/dashboard" className="hover:text-primary transition-colors">
                    For Admins
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Email: support@medaccess.com</li>
                <li>Phone: +91-1234567890</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 MedAccess. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
