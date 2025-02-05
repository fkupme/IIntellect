/*
  Warnings:

  - Made the column `comment` on table `Answer` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Answer" ALTER COLUMN "comment" SET NOT NULL;
