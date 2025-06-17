import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "../../../../../lib/prisma"
import { User } from "next-auth"
import { AdapterUser } from "next-auth/adapters";


interface CredentialsType {
  identifier: string;
  password: string;
};



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text"},
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials):Promise<User | null> {
        const creds = credentials as unknown as CredentialsType;
        try {
          const user = await prisma.user.findFirst({
            where: { email: creds.identifier },
          })
          console.log("user",user)

          if (!user) {
            throw new Error("No user found with this email")
          }

          if (!user.isVerfied) {
            throw new Error("Please verify your account before logging in")
          }

          const isPasswordCorrect = await bcrypt.compare(
            creds.password,
            user.password
          )
          if (isPasswordCorrect) {
            return {
              id: user.id,
              email: user.email,
              name: user.username,
            } as unknown as AdapterUser;
          } else {
            throw new Error("Invalid password")
          }
        } catch (err) {
          console.error("Authorization error:", err)
          return null
        }
      },
    }),
  ],

  pages: {
    signIn: "/signIn", 
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id
        token.isVerified = user.isVerified
        token.isAcceptingMessage = user.isAcceptingMessage
        token.username = user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id
        session.user.isVerified = token.isVerified
        session.user.username = token.username
      }
      return session
    },
  },
}
