-- CreateTable
CREATE TABLE "Item" (
    "itemCode" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "boxNumber" TEXT NOT NULL,
    "spaceNumber" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("itemCode")
);

-- CreateTable
CREATE TABLE "ItemStatusLog" (
    "id" SERIAL NOT NULL,
    "itemCode" TEXT NOT NULL,
    "observation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemStatusLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_itemCode_key" ON "Item"("itemCode");

-- AddForeignKey
ALTER TABLE "ItemStatusLog" ADD CONSTRAINT "ItemStatusLog_itemCode_fkey" FOREIGN KEY ("itemCode") REFERENCES "Item"("itemCode") ON DELETE RESTRICT ON UPDATE CASCADE;
