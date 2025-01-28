-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentAuthMethod" "AuthProvider" NOT NULL DEFAULT 'LOCAL';
