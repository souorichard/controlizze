/*
  Warnings:

  - A unique constraint covering the columns `[name,slug,type,organization_id]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `categories` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "categories_name_type_organization_id_key";

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_slug_type_organization_id_key" ON "categories"("name", "slug", "type", "organization_id");
