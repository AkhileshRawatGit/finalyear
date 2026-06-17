import Link from "next/link"
import { Pill, MapPin, Clock, Heart, Shield, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AboutPage() {
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
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">About MedAccess</h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Your trusted healthcare companion for finding medicines, managing prescriptions,
                        and staying on top of your health needs.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            At MedAccess, we believe healthcare should be accessible, convenient, and stress-free.
                            Our mission is to bridge the gap between patients and pharmacies by providing real-time
                            medicine availability, smart reminders, and comprehensive health record management.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card>
                            <CardHeader>
                                <Shield className="w-10 h-10 text-primary mb-3" />
                                <CardTitle>Trust & Security</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">
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
                                <p className="text-gray-700">
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
                                <p className="text-gray-700">
                                    We strive for excellence in everything we do, from accurate medicine information
                                    to reliable pharmacy partnerships and seamless user experience.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-12">MedAccess by the Numbers</h2>
                    <div className="grid md:grid-cols-4 gap-8">
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary mb-2">2,500+</p>
                            <p className="text-gray-700">Partner Pharmacies</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary mb-2">50,000+</p>
                            <p className="text-gray-700">Medicines Listed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary mb-2">100K+</p>
                            <p className="text-gray-700">Active Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary mb-2">4.8/5</p>
                            <p className="text-gray-700">User Rating</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Our Team</h2>
                    <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                        MedAccess is built by a passionate team of healthcare professionals, software engineers,
                        and designers who are committed to making healthcare more accessible. We combine medical
                        expertise with cutting-edge technology to deliver a platform you can trust.
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Join Us on Our Journey</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Be part of the healthcare revolution. Start finding medicines faster and managing your health better.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline">
                                Contact Us
                            </Button>
                        </Link>
                    </div>
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
