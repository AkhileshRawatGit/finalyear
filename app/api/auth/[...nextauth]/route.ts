import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }
        
        try {
          const db = await getDb();
          const user = await db.collection("User").findOne({ email: credentials.email });

          if (!user) {
            throw new Error("Invalid email or password");
          }

          // Support both bcrypt hashed and plain text passwords for backwards compatibility
          const isMatch = user.password?.startsWith("$2a$") || user.password?.startsWith("$2b$")
            ? await bcrypt.compare(credentials.password, user.password)
            : user.password === credentials.password;
          
          if (!isMatch) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id || user._id?.toString(),
            name: user.name,
            email: user.email,
            userType: user.userType || "customer",
            phone: user.phone || ""
          } as any;
        } catch (error: any) {
          throw new Error(error.message);
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("NextAuth SignIn Callback - Starting - User:", user.email);
      if (account?.provider === "google") {
        try {
          const db = await getDb();
          const existingUser = await db.collection("User").findOne({ email: user.email || "" });
          
          if (!existingUser) {
            console.log("NextAuth SignIn Callback - New Google User detected");
            const userId = `user-${Date.now()}`;
            await db.collection("User").insertOne({
              _id: userId as any,
              id: userId,
              name: user.name || "",
              email: user.email || "",
              phone: "",
              userType: "customer",
              createdAt: new Date(),
              avatar: user.image || ""
            });
          } else {
            console.log("NextAuth SignIn Callback - Existing user found:", existingUser.email);
          }
          return true;
        } catch (error) {
          console.error("NextAuth SignIn Callback - DB ERROR:", error);
          return true; 
        }
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.userType = (user as any).userType || "customer";
        token.phone = (user as any).phone || "";
      }

      // Fetch user details from DB if missing in token
      if (!token.userType || !token.id || token.id.toString().length > 30) { 
        try {
          const db = await getDb();
          const dbUser = await db.collection("User").findOne({ email: token.email || "" });
          if (dbUser) {
            token.id = dbUser.id || dbUser._id?.toString();
            token.userType = dbUser.userType || "customer";
            token.phone = dbUser.phone || "";
          }
        } catch (error) {
          console.error("JWT Callback - DB ERROR fetch:", error);
        }
      }

      if (trigger === "update" && session?.userType) {
        token.userType = session.userType;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).userType = token.userType;
        (session.user as any).phone = token.phone || "";
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login" 
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
