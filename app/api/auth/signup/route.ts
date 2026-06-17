import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, password, userType = "customer", pharmacyDetails } = body

    if (!name || !email || !password || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address format" }, { status: 400 })
    }

    const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/
    if (!phoneRegex.test(phone)) {
      return NextResponse.json({ error: "Invalid 10-digit Indian phone number" }, { status: 400 })
    }

    const db = await getDb()
    const existingUser = await db.collection("User").findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const userId = `user-${Date.now()}`
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user: any = {
      _id: userId,
      id: userId,
      name,
      email,
      phone,
      password: hashedPassword,
      userType: "customer", // Always customer initially in new flow
      createdAt: new Date()
    }

    await db.collection("User").insertOne(user as any)

    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
  }
}
