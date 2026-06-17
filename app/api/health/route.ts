import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/mongodb";

export async function GET() {
  const start = Date.now();
  const dbStatus = await checkDbConnection();
  const duration = Date.now() - start;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    database: dbStatus,
    latency: `${duration}ms`,
    environment: process.env.NODE_ENV,
    tip: dbStatus.status === "error" && dbStatus.message?.includes("IP addr")
      ? "Your current IP is not whitelisted in Atlas. Please add 0.0.0.0/0 to your MongoDB Atlas Network Access."
      : "Check your .env DATABASE_URL if the connection is failing."
  });
}
