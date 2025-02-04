/*
  Warnings:

  - You are about to drop the column `category` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Test` table. All the data in the column will be lost.
  - You are about to drop the column `visibility` on the `Test` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Test` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Test" DROP COLUMN "category",
DROP COLUMN "created_at",
DROP COLUMN "group_id",
DROP COLUMN "subject",
DROP COLUMN "updated_at",
DROP COLUMN "visibility",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "subthemeId" INTEGER,
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "themeId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtheme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "Subtheme_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtheme" ADD CONSTRAINT "Subtheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Test" ADD CONSTRAINT "Test_subthemeId_fkey" FOREIGN KEY ("subthemeId") REFERENCES "Subtheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
