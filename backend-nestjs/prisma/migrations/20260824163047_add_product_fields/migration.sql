/*
  Warnings:

  - A unique constraint covering the columns `[prodCode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `prodCode` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prodGroup` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_categoryId_fkey`;

-- AlterTable
ALTER TABLE `company` ADD COLUMN `empCep` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `prodCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `prodGroup` VARCHAR(191) NOT NULL,
    ADD COLUMN `prodSize` VARCHAR(191) NULL,
    ADD COLUMN `prodType` VARCHAR(191) NULL,
    MODIFY `categoryId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_prodCode_key` ON `Product`(`prodCode`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
