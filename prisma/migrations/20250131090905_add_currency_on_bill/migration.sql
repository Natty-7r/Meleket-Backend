/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `bussiness_package` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `currency` to the `bills` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `bussiness_package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bills" ADD COLUMN     "currency" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "bussiness_package" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "sessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "bussiness_package_reference_key" ON "bussiness_package"("reference");
