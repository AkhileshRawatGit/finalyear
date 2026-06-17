import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, pharmacyId, orderId, rating, comment } = body
    const db = await getDb()

    if (!userId || !pharmacyId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const review = {
      userId,
      pharmacyId,
      orderId,
      rating,
      comment,
      createdAt: new Date()
    }

    const result = await db.collection("Review").insertOne(review)

    // Update Pharmacy aggregate rating
    const pharmacyIdObj = typeof pharmacyId === 'string' && pharmacyId.length === 24 ? new ObjectId(pharmacyId) : pharmacyId
    
    // Simple update logic: find all reviews and calculate average
    const reviews = await db.collection("Review").find({ pharmacyId }).toArray()
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length

    await db.collection("PharmacyStore").updateOne(
      { $or: [{ _id: pharmacyIdObj }, { id: pharmacyId }] },
      { 
        $set: { 
          rating: parseFloat(avgRating.toFixed(1)),
          reviewCount: reviews.length 
        } 
      }
    )

    return NextResponse.json({ ...review, _id: result.insertedId })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const pharmacyId = searchParams.get("pharmacyId")

  if (!pharmacyId) {
    return NextResponse.json({ error: "Pharmacy ID is required" }, { status: 400 })
  }

  try {
    const db = await getDb()
    const reviews = await db.collection("Review").find({ pharmacyId }).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}
