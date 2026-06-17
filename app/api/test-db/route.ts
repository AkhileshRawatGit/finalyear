import { NextResponse } from "next/server"
import { MongoClient } from "mongodb"

export async function GET() {
  const uri = process.env.DATABASE_URL
  if (!uri) return NextResponse.json({ error: "No DATABASE_URL" }, { status: 500 })

  const client = new MongoClient(uri)

  try {
    console.log("Testing NATIVE MongoDB connection in Next.js...")
    await client.connect()
    const db = client.db()
    const collections = await db.listCollections().toArray()
    return NextResponse.json({ 
      success: true, 
      message: "Native MongoDB driver connected successfully!",
      collections: collections.map(c => c.name)
    })
  } catch (err: any) {
    console.error("Native MongoDB connection error:", err)
    return NextResponse.json({ 
      success: false, 
      error: err.message,
      stack: err.stack
    }, { status: 500 })
  } finally {
    await client.close()
  }
}
