/*
  Warnings:

  - You are about to drop the column `inactiveReason` on the `Admin` table. All the data in the column will be lost.
  - The `status` column on the `Admin` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `visibility` column on the `Business` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BusinessStatus" AS ENUM ('CREATED', 'ACTIVE', 'INACTIVE', 'HIDDEN');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'CREATED');

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "inactiveReason",
ADD COLUMN     "inActiveReason" TEXT DEFAULT 'new account',
DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "inActiveReason" TEXT DEFAULT 'new account',
DROP COLUMN "visibility",
ADD COLUMN     "visibility" "BusinessStatus" NOT NULL DEFAULT 'CREATED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "inActiveReason" TEXT NOT NULL DEFAULT 'new account',
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'CREATED';

-- DropEnum
DROP TYPE "AdminStatus";

-- DropEnum
DROP TYPE "BusinessVisiblityStatus";
