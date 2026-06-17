import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ 
    message: "Seeding is disabled for production to protect your data. Please use the registration flow to create real accounts and the Pharmacy Dashboard to manage inventory.",
    status: "protected"
  })
}
