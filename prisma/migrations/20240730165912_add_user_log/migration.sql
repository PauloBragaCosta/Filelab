/*
  Warnings:

  - Added the required column `UserCreated` to the `ItemStatusLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ItemStatusLog" ADD COLUMN     "UserCreated" TEXT NOT NULL;
