import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ownerId = searchParams.get("ownerId")
    const id = searchParams.get("id")
    const db = await getDb()

    if (id) {
      const pharmacy = await db.collection("PharmacyStore").findOne({ _id: id as any })
      if (!pharmacy) return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
      return NextResponse.json(pharmacy)
    }

    if (ownerId) {
      const pharmacy = await db.collection("PharmacyStore").findOne({ ownerId })
      if (!pharmacy) return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
      return NextResponse.json(pharmacy)
    }

    const pharmacies = await db.collection("PharmacyStore").find({}).sort({ rating: -1 }).toArray()
    return NextResponse.json(pharmacies)
  } catch (error) {
    console.error("Error fetching pharmacies:", error)
    return NextResponse.json({ error: "Failed to fetch pharmacies" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log("Pharmacy Registration - Received Body:", JSON.stringify(body))
    const { userId, ...pharmacyDetails } = body

    if (!userId || !pharmacyDetails.name || !pharmacyDetails.address) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()

    // Check if user already has a pharmacy
    const existing = await db.collection("PharmacyStore").findOne({ ownerId: userId })
    
    if (existing) {
      return NextResponse.json({ error: "User already registered a pharmacy" }, { status: 400 })
    }

    const pharmacyId = `pharm-${Date.now()}`
    
    const isRishikesh = pharmacyDetails.city?.toLowerCase().includes("rishikesh")
    const lat = isRishikesh ? 30.0869 + (Math.random() - 0.5) * 0.05 : 28.6139 + (Math.random() - 0.5) * 0.1
    const lng = isRishikesh ? 78.2676 + (Math.random() - 0.5) * 0.05 : 77.2090 + (Math.random() - 0.5) * 0.1

    const pharmacyRecord = {
      _id: pharmacyId,
      id: pharmacyId,
      ownerId: userId,
      name: pharmacyDetails.name,
      email: pharmacyDetails.email,
      phone: pharmacyDetails.phone,
      location: {
        latitude: lat,
        longitude: lng,
        address: `${pharmacyDetails.address}, ${pharmacyDetails.city}`,
      },
      deliveryAvailable: !!pharmacyDetails.deliveryAvailable,
      deliveryRadius: 5,
      openingTime: "08:00 AM",
      closingTime: "10:00 PM",
      rating: 5,
      reviews: 0,
      stock: [],
      createdAt: new Date()
    }

    await db.collection("PharmacyStore").insertOne(pharmacyRecord as any)

    // Upgrade the user to a pharmacy user
    await db.collection("User").updateOne(
      { $or: [{ id: userId }, { _id: userId as any }] },
      { $set: { userType: "pharmacy" } }
    )

    return NextResponse.json({ success: true, pharmacy: pharmacyRecord })
  } catch (error: any) {
    console.error("Pharmacy registration error DETAILS:", error.message, error.stack)
    return NextResponse.json({ error: "Failed to register pharmacy" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { pharmacyId, latitude, longitude, address } = body

    if (!pharmacyId || latitude === undefined || longitude === undefined) {
      return NextResponse.json({ error: "Pharmacy ID and coordinates are required" }, { status: 400 })
    }

    const db = await getDb()
    
    const updateData: any = {
      "location.latitude": latitude,
      "location.longitude": longitude,
      updatedAt: new Date()
    }

    if (address) {
      updateData["location.address"] = address
    }

    const result = await db.collection("PharmacyStore").findOneAndUpdate(
      { $or: [{ id: pharmacyId }, { _id: pharmacyId as any }] },
      { $set: updateData },
      { returnDocument: 'after' }
    )

    if (!result) {
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, pharmacy: result })
  } catch (error: any) {
    console.error("Error updating pharmacy location:", error)
    return NextResponse.json({ error: "Failed to update pharmacy location" }, { status: 500 })
  }
}

