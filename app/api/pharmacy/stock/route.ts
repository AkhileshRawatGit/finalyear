import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pharmacyId, medicineId, name, type, quantity, price, expiryDate } = body

    if (!pharmacyId || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await getDb()

    // 1. Ensure the Pharmacy exists
    const pharmacy = await db.collection("PharmacyStore").findOne({ _id: pharmacyId as any })

    if (!pharmacy) {
      return NextResponse.json({ error: "Pharmacy not found" }, { status: 404 })
    }

    // 2. Find medicine by name or ID
    let finalMedicineId = medicineId
    if (!finalMedicineId) {
      const existingMedicine = await db.collection("Medicine").findOne({
        name: { $regex: name, $options: "i" }
      })
      
      if (existingMedicine) {
        finalMedicineId = existingMedicine._id?.toString() || existingMedicine.id
      } else {
        // Create a new medicine entry if it doesn't exist
        const newMedId = `med-${Date.now()}`
        await db.collection("Medicine").insertOne({
          _id: newMedId as any,
          id: newMedId,
          name,
          genericName: name,
          category: type || "Tablet",
          strength: "N/A",
          manufacturer: "Generic",
          price: price || 0,
          description: "No description provided",
          expiryDate: expiryDate || "2026-12-31",
          requiresPrescription: false,
          sideEffects: [],
          uses: [],
          precautions: [],
          substitutes: []
        } as any)
        finalMedicineId = newMedId
      }
    }

    // 3. Update the stock in the PharmacyStore
    const currentStock = (pharmacy.stock as any[]) || []
    const existingStockIndex = currentStock.findIndex((s: any) => s.medicineId === finalMedicineId)

    let updatedStock = [...currentStock]
    if (existingStockIndex >= 0) {
      // Update quantity
      updatedStock[existingStockIndex] = {
        ...updatedStock[existingStockIndex],
        quantity: (updatedStock[existingStockIndex].quantity || 0) + (quantity || 0),
        price: price || updatedStock[existingStockIndex].price,
        expiryDate: expiryDate || updatedStock[existingStockIndex].expiryDate,
        lastUpdated: new Date().toISOString()
      }
    } else {
      // Add new stock item
      updatedStock.push({
        medicineId: finalMedicineId,
        medicineName: name,
        quantity: quantity || 0,
        reorderLevel: 50,
        price: price || 0,
        expiryDate: expiryDate || "2026-12-31",
        lastUpdated: new Date().toISOString()
      })
    }

    await db.collection("PharmacyStore").updateOne(
      { _id: pharmacyId as any },
      { $set: { stock: updatedStock } }
    )

    const updatedPharmacy = await db.collection("PharmacyStore").findOne({ _id: pharmacyId as any })

    return NextResponse.json(updatedPharmacy)
  } catch (error: any) {
    console.error("Stock update error:", error.message, error.stack)
    return NextResponse.json({ error: "Failed to update stock" }, { status: 500 })
  }
}
