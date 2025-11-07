import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Username",
          type: "text",
          placeholder: "Johndoe@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const User = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            }
          })
          if (!User) {
            throw new Error("User Doesn't exist,Please Login")
            return null;
          }
          const VerifyPass = await bcrypt.compare(credentials.password, User.password);
          if (!VerifyPass) {
            throw new Error("Invalid Credentials")
          }
          return User;
        }
        catch (error: any) {
          throw new Error(error.message || "Authentication Failed");
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id?.toString();
        token.email = user.email;
        token.username = user.username;

      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
      }
      return session
    }
  },
  pages:{
    signIn:'/signin'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug:true
};
