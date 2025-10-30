-- CreateEnum
CREATE TYPE "ExecutionType" AS ENUM ('CONVERSATION', 'ARTICLE_SUMMARIZER', 'WEBSITE_CREATOR');

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
