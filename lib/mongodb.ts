import { MongoClient, Db } from 'mongodb';

const uri = process.env.DATABASE_URL || "";
const options = {
  connectTimeoutMS: 30000,
  serverSelectionTimeoutMS: 30000,
  tls: true,
  tlsAllowInvalidCertificates: true,
};

if (!uri) {
  throw new Error('Please add your Mongo URI to .env');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect()
      .then(client => {
        console.log("✅ MongoDB connected successfully to Atlas shards.");
        return client;
      })
      .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
        if (err.message.includes("IP addr")) {
          console.error("👉 TIP: This is likely an IP Whitelist issue. Please add 0.0.0.0/0 in Atlas.");
        }
        throw err;
      });
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  try {
    const client = await clientPromise;
    return client.db('medaccess');
  } catch (error: any) {
    console.error("getDb Failed:", error.message);
    throw error;
  }
}

/**
 * Diagnostic function to check DB health
 */
export async function checkDbConnection() {
  try {
    const client = await clientPromise;
    const admin = client.db('admin');
    const result = await admin.command({ ping: 1 });
    return { status: "connected", ping: result.ok === 1 };
  } catch (error: any) {
    return { status: "error", message: error.message };
  }
}
