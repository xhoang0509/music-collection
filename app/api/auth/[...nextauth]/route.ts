import NextAuth, { DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

// Extend the built-in session type
declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean
    } & DefaultSession["user"]
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Only allow specific admin email(s) to sign in
        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
        const isAdmin = adminEmails.includes(user.email || "")
        
        if (!isAdmin) {
          console.log(`Access denied for email: ${user.email}`)
          return false
        }
        
        console.log(`Admin access granted for email: ${user.email}`)
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return false
      }
    },
    async session({ session, token }) {
      try {
        // Add admin status to the session
        const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
        if (session.user?.email) {
          session.user.isAdmin = adminEmails.includes(session.user.email)
        }
        return session
      } catch (error) {
        console.error("Error in session callback:", error)
        return session
      }
    },
    async jwt({ token, user, account }) {
      try {
        // Add admin status to the token
        if (user) {
          const adminEmails = process.env.ADMIN_EMAILS?.split(",") || []
          token.isAdmin = adminEmails.includes(user.email || "")
        }
        return token
      } catch (error) {
        console.error("Error in jwt callback:", error)
        return token
      }
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }

