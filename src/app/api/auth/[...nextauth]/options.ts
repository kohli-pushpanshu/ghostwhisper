// lib/authOptions.ts or pages/api/auth/[...nextauth].ts

import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "../../../../../lib/prisma"



export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        try {
          console.log('searching for email', credentials)
            const user = await prisma.user.findFirst({where:{email:credentials.identifier}
            });

            console.log('[OPTIONS]: user', user)

            if(!user){
                throw new Error('No User found with this email')
            }

            if(!user.isVerfied){
                throw new Error("Please verify your account before login")
            }

            const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
            if (isPasswordCorrect) {
                return user;
            }else{
              
                throw new Error("Invalid password")
            }

        } catch (err: any) {
            throw new Error(err)
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
  secret:process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id
        token.isVerified = user.isVerfied;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username=user.username
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user._id= token._id
        session.user.isVerified = token.isVerified
        session.user.username = token.username
      }
      return session
    },
  },
}
