/*
  Warnings:

  - You are about to drop the column `endDate` on the `BusinessPackage` table. All the data in the column will be lost.
  - Added the required column `expreDate` to the `BusinessPackage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "BusinessPackage" DROP COLUMN "endDate",
ADD COLUMN     "expreDate" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "expired" SET DEFAULT false;
