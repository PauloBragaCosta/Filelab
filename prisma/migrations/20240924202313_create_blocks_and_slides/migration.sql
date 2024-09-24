/*
  Warnings:

  - You are about to drop the column `UserCreated` on the `ItemStatusLog` table. All the data in the column will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userCreated` to the `ItemStatusLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemStatusLog" DROP CONSTRAINT "ItemStatusLog_itemCode_fkey";

-- AlterTable
ALTER TABLE "ItemStatusLog" DROP COLUMN "UserCreated",
ADD COLUMN     "userCreated" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "uid" DROP NOT NULL;

-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "Block" (
    "itemCode" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "boxNumber" TEXT NOT NULL,
    "spaceNumber" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Block_pkey" PRIMARY KEY ("itemCode")
);

-- CreateTable
CREATE TABLE "Slide" (
    "itemCode" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "boxNumber" TEXT NOT NULL,
    "spaceNumber" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Slide_pkey" PRIMARY KEY ("itemCode")
);

-- CreateIndex
CREATE UNIQUE INDEX "Block_itemCode_key" ON "Block"("itemCode");

-- CreateIndex
CREATE UNIQUE INDEX "Slide_itemCode_key" ON "Slide"("itemCode");

-- AddForeignKey
ALTER TABLE "ItemStatusLog" ADD CONSTRAINT "Block_itemCode_fkey" FOREIGN KEY ("itemCode") REFERENCES "Block"("itemCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStatusLog" ADD CONSTRAINT "Slide_itemCode_fkey" FOREIGN KEY ("itemCode") REFERENCES "Slide"("itemCode") ON DELETE RESTRICT ON UPDATE CASCADE;
