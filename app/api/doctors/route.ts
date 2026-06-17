import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET() {
  try {
    const db = await getDb()
    const doctors = await db.collection("DoctorMapping").find({}).toArray()
    
    // Ensure IDs are strings for the frontend
    const formattedDoctors = doctors.map(doc => ({
      ...doc,
      id: doc.id || doc._id?.toString(),
    }))

    return NextResponse.json(formattedDoctors)
  } catch (error: any) {
    console.error("Error fetching doctors:", error.message)
    return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
  }
}
