"use server";

import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function signUpUser(formData: {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  try {
    // Validation
    if (!formData.username || formData.username.length < 3) {
      return {
        success: false,
        error: "Username must be at least 3 characters long",
      };
    }

    if (!formData.email || !formData.email.includes("@")) {
      return {
        success: false,
        error: "Please enter a valid email address",
      };
    }

    if (!formData.password || formData.password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters long",
      };
    }

    if (formData.password !== formData.confirmPassword) {
      return {
        success: false,
        error: "Passwords do not match",
      };
    }

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: formData.email,
      },
    });

    if (existingUserByEmail) {
      return {
        success: false,
        error: "User with this email already exists",
      };
    }

    const existingUserByUsername = await prisma.user.findFirst({
      where: {
        username: formData.username,
      },
    });

    if (existingUserByUsername) {
      return {
        success: false,
        error: "Username is already taken",
      };
    }

    // Hash password
    const hashedPassword = await hash(formData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: formData.username,
        email: formData.email,
        password: hashedPassword,
      },
    });

    console.log("✅ User created:", user.email);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      },
    };
  } catch (error: any) {
    console.error("❌ Sign up error:", error);
    return {
      success: false,
      error: error.message || "Something went wrong. Please try again.",
    };
  }
}