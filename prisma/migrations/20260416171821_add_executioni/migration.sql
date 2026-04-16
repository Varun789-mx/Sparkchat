/*
  Warnings:

  - You are about to drop the column `title` on the `Conversation` table. All the data in the column will be lost.
  - Made the column `description` on table `App` required. This step will fail if there are existing NULL values in that column.
  - Made the column `icon` on table `App` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ExecutionType" AS ENUM ('CONVERSATION', 'ARTICLE_SUMMARIZER', 'WEBSITE_CREATOR');

-- AlterTable
ALTER TABLE "App" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "icon" SET NOT NULL;

-- AlterTable
ALTER TABLE "Conversation" DROP COLUMN "title";

-- CreateTable
CREATE TABLE "Execution" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ExecutionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "externalId" TEXT,

    CONSTRAINT "Execution_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Execution" ADD CONSTRAINT "Execution_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
