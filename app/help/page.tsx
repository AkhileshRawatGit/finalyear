"use client"

import Link from "next/link"
import { useState } from "react"
import { Pill, Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function HelpPage() {
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
            answer: "MedAccess is free for users! You can search medicines, set reminders, and manage health records at no cost. Some premium features like advanced analytics and priority support are available with our Pro plan."
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
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">Help Center</h1>
                    <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                        Find answers to common questions and learn how to make the most of MedAccess
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search for help articles..."
                                className="pl-12 pr-4 py-6 text-lg bg-white rounded-xl border-0 shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Help Categories */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <BookOpen className="w-10 h-10 text-primary mb-3" />
                                <CardTitle>Getting Started</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">
                                    Learn the basics of using MedAccess, from creating an account to finding your first medicine.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <HelpCircle className="w-10 h-10 text-primary mb-3" />
                                <CardTitle>Account & Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">
                                    Manage your profile, privacy settings, notifications, and account preferences.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <MessageCircle className="w-10 h-10 text-primary mb-3" />
                                <CardTitle>Orders & Delivery</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">
                                    Track orders, manage deliveries, and understand our refund and return policies.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 px-4 bg-gray-50">
                <div className="container mx-auto max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
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
                                        <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Support */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Our support team is here to assist you. Reach out and we'll get back to you as soon as possible.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/contact">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Contact Support
                            </Button>
                        </Link>
                        <a href="mailto:support@medaccess.com">
                            <Button size="lg" variant="outline">
                                Email Us
                            </Button>
                        </a>
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
