import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Bennett SSO',
      credentials: {
        enrollmentNumber: { label: "Enrollment Number / Admin ID", type: "text", placeholder: "E.g. S21CSEU0000 or admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Mock Admin Login
        if (credentials?.enrollmentNumber === 'admin' && credentials?.password === 'admin') {
          return {
            id: 'admin',
            name: 'System Administrator',
            email: 'admin@bennett.edu.in',
            role: 'ADMIN'
          } as any
        }
        // Mock Student SSO logic
        if (credentials?.enrollmentNumber?.startsWith('S') && credentials.password === 'bennett') {
          return {
            id: credentials.enrollmentNumber,
            name: "Bennett Student",
            email: `${credentials.enrollmentNumber.toLowerCase()}@bennett.edu.in`,
            role: 'STUDENT'
          } as any
        }
        return null
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).studentId = token.sub;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_for_local_development_only_123456",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }
