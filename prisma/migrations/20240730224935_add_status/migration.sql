/*
  Warnings:

  - Added the required column `status` to the `ItemStatusLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemStatusLog" ADD COLUMN     "status" TEXT NOT NULL;
