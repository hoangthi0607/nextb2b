/*
  Warnings:

  - You are about to drop the column `unit` on the `Product` table. All the data in the column will be lost.
  - Added the required column `unitId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sortOrder` to the `ProductImage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `warehouseId` to the `Shipment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `StockMovement` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('import', 'export', 'adjust');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "unit",
ADD COLUMN     "unitId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "sortOrder" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shipment" ADD COLUMN     "warehouseId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "StockMovement" DROP COLUMN "type",
ADD COLUMN     "type" "StockMovementType" NOT NULL;

-- CreateTable
CREATE TABLE "ProductUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "ProductUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductUnit_name_key" ON "ProductUnit"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "ProductUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_warehouseId_fkey" FOREIGN KEY ("warehouseId") REFERENCES "Warehouse"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
