import { NextResponse } from "next/server"
import { getDb } from "@/lib/mongodb"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userId, pharmacyId, medicines, totalPrice, deliveryType } = body
    const db = await getDb()

    // 1. Create the order in MongoDB
    const orderData: any = {
      userId,
      pharmacyId,
      totalPrice,
      deliveryType,
      status: "pending",
      medicines: medicines.map((item: any) => ({
        medicineId: item.medicineId,
        quantity: item.quantity,
        price: item.price
      })),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    const result = await db.collection("Order").insertOne(orderData)
    const order = { ...orderData, _id: result.insertedId, id: result.insertedId }

    // 2. Update stock levels for each medicine in the pharmacy
    const { ObjectId } = require('mongodb')
    for (const item of medicines) {
      let pharmacyIdObj = pharmacyId
      try {
        if (typeof pharmacyId === 'string' && pharmacyId.length === 24) {
          pharmacyIdObj = new ObjectId(pharmacyId)
        }
      } catch (e) {
        // Fallback to string ID
      }
      
      const pharmacy: any = await db.collection("PharmacyStore").findOne({ 
        $or: [{ _id: pharmacyIdObj }, { id: pharmacyId }, { _id: pharmacyId }] 
      })

      if (pharmacy && pharmacy.stock) {
        const updatedStock = pharmacy.stock.map((s: any) => {
          if (s.medicineId === item.medicineId) {
            return { ...s, quantity: Math.max(0, s.quantity - item.quantity) }
          }
          return s
        })

        await db.collection("PharmacyStore").updateOne(
          { $or: [{ _id: pharmacyIdObj }, { id: pharmacyId }] },
          { $set: { stock: updatedStock } }
        )

        // 3. Trigger Pusher event for real-time stock update
        await pusherServer.trigger(`pharmacy-${pharmacyId}`, "stock-update", {
          medicineId: item.medicineId,
          newQuantity: updatedStock.find((s: any) => s.medicineId === item.medicineId)?.quantity
        })
      }
    }

    // 4. Trigger event for the pharmacy dashboard to see the new order
    await pusherServer.trigger(`admin-${pharmacyId}`, "new-order", order)

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const pharmacyId = searchParams.get("pharmacyId")

  const filter: any = {}
  if (userId) filter.userId = userId
  if (pharmacyId) filter.pharmacyId = pharmacyId

  try {
    const db = await getDb()
    const orders = await db.collection("Order").find(filter).sort({ createdAt: -1 }).toArray()
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { orderId, status } = body
    const db = await getDb()

    const isDelivered = status === 'delivered'

    if (!orderId || !status) {
      return NextResponse.json({ error: "Order ID and status are required" }, { status: 400 })
    }

    // Update order in DB
    const result = await db.collection("Order").findOneAndUpdate(
      { _id: orderId } as any,
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    )

    if (!result) {
      // Try with ObjectId if string ID fails (fallback for different ID types)
      const { ObjectId } = require('mongodb')
      try {
        const resultObj = await db.collection("Order").findOneAndUpdate(
          { _id: new ObjectId(orderId) },
          { $set: { status, updatedAt: new Date() } },
          { returnDocument: 'after' }
        )
        if (!resultObj) throw new Error("Order not found")
        
        // Trigger notification for the user
        await pusherServer.trigger(`user-${resultObj.userId}`, "order-status-update", {
          orderId,
          status,
          pharmacyId: resultObj.pharmacyId,
          message: isDelivered ? `Your order has been delivered! Please leave a review.` : `Your order status has been updated to: ${status}`
        })
        
        return NextResponse.json(resultObj)
      } catch (e) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 })
      }
    }

    // Trigger notification for the user
    await pusherServer.trigger(`user-${result.userId}`, "order-status-update", {
      orderId,
      status,
      pharmacyId: result.pharmacyId,
      message: isDelivered ? `Your order has been delivered! Please leave a review.` : `Your order status has been updated to: ${status}`
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
