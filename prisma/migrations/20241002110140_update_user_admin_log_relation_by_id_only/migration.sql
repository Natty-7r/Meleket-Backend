-- CreateEnum
CREATE TYPE "LogType" AS ENUM ('USER_ACTIVITY', 'ADMIN_ACTIVITY', 'ERROR', 'WARNING');

-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "logType" "LogType" NOT NULL,
    "message" TEXT NOT NULL,
    "context" TEXT,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "archivedAt" TIMESTAMP(3),
    "userId" TEXT,
    "adminId" TEXT,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
