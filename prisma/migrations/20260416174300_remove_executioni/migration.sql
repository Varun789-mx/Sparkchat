/*
  Warnings:

  - You are about to drop the `Execution` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Execution" DROP CONSTRAINT "Execution_userId_fkey";

-- AlterTable
ALTER TABLE "App" ADD COLUMN     "title" TEXT NOT NULL;

-- DropTable
DROP TABLE "Execution";

-- DropEnum
DROP TYPE "ExecutionType";
