import Link from "next/link"
import { Pill, Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary/90 flex items-center justify-center shadow-lg">
                                    <Pill className="w-6 h-6 text-white" />
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl text-gray-900">MedAccess</span>
                                <span className="text-sm text-gray-600 -mt-0.5">Healthcare Accessible to All</span>
                            </div>
                        </Link>
                        <Link href="/">
                            <Button variant="ghost">Back to Home</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto max-w-4xl text-center">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">Contact Us</h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Have questions? We're here to help. Reach out to us through any of the channels below.
                    </p>
                </div>
            </section>

            {/* Contact Information */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
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
                                <p className="text-gray-700 mb-2">General Inquiries:</p>
                                <a href="mailto:support@medaccess.com" className="text-primary hover:underline font-medium">
                                    support@medaccess.com
                                </a>
                                <p className="text-gray-700 mt-4 mb-2">Business Partnerships:</p>
                                <a href="mailto:business@medaccess.com" className="text-primary hover:underline font-medium">
                                    business@medaccess.com
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
                                <p className="text-gray-700 mb-2">Customer Support:</p>
                                <a href="tel:+911234567890" className="text-primary hover:underline font-medium text-lg">
                                    +91-1234-567-890
                                </a>
                                <p className="text-gray-700 mt-4 mb-2">Toll-Free:</p>
                                <a href="tel:18001234567" className="text-primary hover:underline font-medium text-lg">
                                    1800-123-4567
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
                                <p className="text-gray-700 mb-2">Head Office:</p>
                                <p className="font-medium">
                                    MedAccess Technologies Pvt. Ltd.<br />
                                    123 Healthcare Plaza,<br />
                                    MG Road, Bangalore - 560001<br />
                                    Karnataka, India
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Business Hours */}
                    <Card className="mb-16">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Clock className="w-6 h-6 text-primary" />
                                <CardTitle>Business Hours</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold mb-3">Customer Support</h3>
                                    <p className="text-gray-700">Monday - Friday: 9:00 AM - 8:00 PM</p>
                                    <p className="text-gray-700">Saturday: 10:00 AM - 6:00 PM</p>
                                    <p className="text-gray-700">Sunday: 10:00 AM - 4:00 PM</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-3">Emergency Support</h3>
                                    <p className="text-gray-700">Available 24/7 for urgent medicine queries</p>
                                    <p className="text-primary font-medium mt-2">Call: +91-9876-543-210</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

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
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Full Name</label>
                                        <Input type="text" placeholder="Enter your name" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email Address</label>
                                        <Input type="email" placeholder="your.email@example.com" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                                        <Input type="tel" placeholder="+91-XXXXX-XXXXX" />
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

            {/* FAQ Quick Links */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Looking for Quick Answers?</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Check out our Help Center for frequently asked questions and guides.
                    </p>
                    <Link href="/help">
                        <Button size="lg" variant="outline">
                            Visit Help Center
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-border py-8 px-4 bg-muted/30">
                <div className="container mx-auto max-w-6xl text-center text-sm text-muted-foreground">
                    <p>© 2025 MedAccess. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}
