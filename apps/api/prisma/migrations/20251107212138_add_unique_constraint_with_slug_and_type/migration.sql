/*
  Warnings:

  - A unique constraint covering the columns `[slug,type]` on the table `categories` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_type_key" ON "categories"("slug", "type");
