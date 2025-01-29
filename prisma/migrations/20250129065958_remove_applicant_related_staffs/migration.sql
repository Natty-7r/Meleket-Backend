/*
  Warnings:

  - The values [APPLICANT] on the enum `ModuleName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ModuleName_new" AS ENUM ('ROLE', 'PERMISSION', 'ADMIN', 'USER', 'PROFILE', 'BUSINESS', 'BUSINESS_SERVICE', 'BUSINESS_ADDRESS', 'BUSINESS_CONTACT', 'CATEGORY', 'BILL', 'PACKAGE', 'BUSINESS_PACKAGE', 'STORY', 'STORY_VIEW', 'REVIEW', 'RATING', 'OTP', 'LOG');
ALTER TABLE "permissions" ALTER COLUMN "moduleName" TYPE "ModuleName_new" USING ("moduleName"::text::"ModuleName_new");
ALTER TYPE "ModuleName" RENAME TO "ModuleName_old";
ALTER TYPE "ModuleName_new" RENAME TO "ModuleName";
DROP TYPE "ModuleName_old";
COMMIT;
