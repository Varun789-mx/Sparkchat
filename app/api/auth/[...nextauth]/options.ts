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
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
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
            console.log("User Doesn't exist,Please Login")
            return null;
          }
          if (!User.password) {
            throw new Error("Please Sign in with google or github");
          }
          const VerifyPass = await bcrypt.compare(credentials.password, User.password);
          if (!VerifyPass) {
            throw new Error("Invalid Credentials")
          }
          return {
            id: User.id,
            email: User.email,
            username: User.username,
            image: User.image ?? undefined,
            ispremium: User.isPremium,
          };
        }
        catch (error: any) {
          throw new Error(error.message || "Authentication Failed");
          return null;
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          if (!user.email) {
            console.log("No email in provided by the Oauth provider")
            return false;
          }
          const existingUser = await prisma.user.findUnique({
            where: {
              email: user.email
            }
          })
          if (existingUser) {
            const existingAccount = await prisma.account.findUnique({
              where: {
                provider_providerAccountId: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId
                }
              }
            })
            if (!existingAccount) {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  access_token: account.access_token,
                  refresh_token: account.refresh_token,
                  expires_at: account.expires_at,
                  token_type: account.token_type,
                  scope: account.scope,
                  id_token: account.id_token,
                  session_state: account.session_state
                }
              });
            }
            return true;
          } else {
            const NewUser = await prisma.user.create({
              data: {
                email: user.email,
                username: user.name || user.email.split("@")[0] || 'user',
                password: null,
                image: user.image,
              }
            })
            await prisma.account.create({
              data: {
                userId: NewUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
                session_state: account.session_state
              }
            })
            return true;
          }
        } catch (error) {
          console.log("Error in creating or find the user", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        const dbUser = await prisma.user.findUnique({
          where: {
            email: token.email
          }
        })
        if (dbUser) {
          token.id = dbUser.id;
          token.email = dbUser.email;
          token.username = dbUser.username;
          token.image = dbUser.image || "";
          token.ispremium = dbUser.isPremium;
        }
      }
      else if (user) {
        token.id = user.id,
          token.email = user.email;
        token.username = user.username;
        token.image = user.image;
        token.ispremium = user.ispremium;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.username = token.username;
        session.user.image = token.image;
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
};
