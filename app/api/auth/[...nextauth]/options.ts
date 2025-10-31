import { NextauthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import Usermodel from "@/lib/UserModel";





export const authOptions: NextauthOptions = {
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
      async authorize(credentials:any):Promise<any> { 
        const password = credentials.password;
        const VerifyPass = await bcrypt.compare(credentials.password,Prisma.UserScalarFieldEnum.password);
try {
          }catch(error:any) { 
            throw new Error(error)
          } 
        
      }
    }),
  ],
};
