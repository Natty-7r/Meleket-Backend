/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `package` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "package_name_key" ON "package"("name");
