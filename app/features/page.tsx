import Link from "next/link"
import { Pill, MapPin, Clock, Heart, AlertCircle, TrendingUp, Bell, ShoppingBag, FileText, Shield, Smartphone, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FeaturesPage() {
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
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">Powerful Features for Better Healthcare</h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Everything you need to manage your medicines and health records in one comprehensive platform
                    </p>
                </div>
            </section>

            {/* Main Features */}
            <section className="py-16 px-4">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700 leading-relaxed">
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
                                <p className="text-gray-700">
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
                                <p className="text-gray-700">
                                    Access MedFinder on the go with our mobile apps for iOS and Android. Sync your
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
                                <p className="text-gray-700">
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
                                <p className="text-gray-700">
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
                                <p className="text-gray-700">
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
                                <p className="text-gray-700">
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
                                <p className="text-gray-700">
                                    Set reminders, track your medication history, and store all health records securely
                                    in your personal health vault.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl font-bold mb-6">Ready to Experience Better Healthcare?</h2>
                    <p className="text-lg text-gray-700 mb-8">
                        Join thousands of users who are already managing their medications more effectively
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-primary hover:bg-primary/90">
                                Get Started Free
                            </Button>
                        </Link>
                        <Link href="/about">
                            <Button size="lg" variant="outline">
                                Learn More
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
