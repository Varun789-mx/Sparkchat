import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from '@/lib/prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
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
        token.credits = user.credits;
        token.ispremium = user.ispremium;
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.credits = token.credits;
        session.user.ispremium = token.ispremium;
      }
      return session
    }
  },
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true
};
