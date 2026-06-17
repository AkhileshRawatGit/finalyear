import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  try {
    const db = await getDb()
    const reminders = await db.collection("MedicineReminder")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(reminders)
  } catch (error) {
    console.error("Error fetching reminders:", error)
    return NextResponse.json({ error: "Failed to fetch reminders" }, { status: 500 })
  }
}
