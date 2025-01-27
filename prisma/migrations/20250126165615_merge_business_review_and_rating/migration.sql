/*
  Warnings:

  - You are about to drop the `rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_businessId_fkey";

-- DropForeignKey
ALTER TABLE "rating" DROP CONSTRAINT "rating_userId_fkey";

-- AlterTable
ALTER TABLE "raview" ADD COLUMN     "rating" INTEGER,
ALTER COLUMN "review" DROP NOT NULL;

-- DropTable
DROP TABLE "rating";
