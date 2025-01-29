/*
  Warnings:

  - You are about to drop the column `contentType` on the `user_story_view` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `user_story_view` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_story_view" DROP COLUMN "contentType",
DROP COLUMN "image",
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "textViewOrder" INTEGER[];

-- DropEnum
DROP TYPE "StoryContentType";
