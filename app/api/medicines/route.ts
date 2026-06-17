import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")
  const category = searchParams.get("category")
  const id = searchParams.get("id")

  try {
    const db = await getDb()
    
    if (id) {
      const medicine = await db.collection("Medicine").findOne({ id })
      if (!medicine) {
        // Try with MongoDB ObjectId if string ID fails
        const { ObjectId } = require('mongodb')
        try {
          const medObj = await db.collection("Medicine").findOne({ _id: new ObjectId(id) })
          return NextResponse.json(medObj)
        } catch (e) {
          return NextResponse.json({ error: "Medicine not found" }, { status: 404 })
        }
      }
      return NextResponse.json(medicine)
    }

    const filter: any = {}
    
    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } }
      ]
    }
    
    if (category) {
      filter.category = category
    }

    const medicines = await db.collection("Medicine").find(filter).toArray()
    return NextResponse.json(medicines)
  } catch (error) {
    console.error("Error fetching medicines:", error)
    return NextResponse.json({ error: "Failed to fetch medicines" }, { status: 500 })
  }
}
