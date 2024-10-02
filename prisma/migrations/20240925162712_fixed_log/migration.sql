/*
  Warnings:

  - You are about to drop the column `itemCode` on the `ItemStatusLog` table. All the data in the column will be lost.
  - Added the required column `itemType` to the `ItemStatusLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemStatusLog" DROP CONSTRAINT "Block_itemCode_fkey";

-- DropForeignKey
ALTER TABLE "ItemStatusLog" DROP CONSTRAINT "Slide_itemCode_fkey";

-- AlterTable
ALTER TABLE "ItemStatusLog" DROP COLUMN "itemCode",
ADD COLUMN     "blockId" TEXT,
ADD COLUMN     "itemType" TEXT NOT NULL,
ADD COLUMN     "slideId" TEXT;

-- CreateIndex
CREATE INDEX "ItemStatusLog_blockId_idx" ON "ItemStatusLog"("blockId");

-- CreateIndex
CREATE INDEX "ItemStatusLog_slideId_idx" ON "ItemStatusLog"("slideId");

-- AddForeignKey
ALTER TABLE "ItemStatusLog" ADD CONSTRAINT "ItemStatusLog_blockId_fkey" FOREIGN KEY ("blockId") REFERENCES "Block"("itemCode") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemStatusLog" ADD CONSTRAINT "ItemStatusLog_slideId_fkey" FOREIGN KEY ("slideId") REFERENCES "Slide"("itemCode") ON DELETE SET NULL ON UPDATE CASCADE;
