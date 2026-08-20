/*
  Warnings:

  - You are about to drop the column `name` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `product` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prodName` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prodOriginalPrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` DROP COLUMN `name`,
    DROP COLUMN `price`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `companyId` INTEGER NOT NULL,
    ADD COLUMN `preferenceId` INTEGER NULL,
    ADD COLUMN `prodDescription` TEXT NULL,
    ADD COLUMN `prodImageUrl` TEXT NULL,
    ADD COLUMN `prodName` VARCHAR(191) NOT NULL,
    ADD COLUMN `prodOriginalPrice` DOUBLE NOT NULL,
    ADD COLUMN `prodPromotionalPrice` DOUBLE NULL,
    ADD COLUMN `prodRating` DOUBLE NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `userAddress` VARCHAR(191) NULL,
    ADD COLUMN `userCity` VARCHAR(191) NULL,
    ADD COLUMN `userLogo` TEXT NULL,
    ADD COLUMN `userNeighborhood` VARCHAR(191) NULL,
    ADD COLUMN `userState` VARCHAR(191) NULL,
    ADD COLUMN `userStreet` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Company` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `empName` VARCHAR(191) NOT NULL,
    `empNameFantasy` VARCHAR(191) NOT NULL,
    `empCnpj` VARCHAR(191) NOT NULL,
    `empAddress` VARCHAR(191) NULL,
    `empStreet` VARCHAR(191) NULL,
    `empNeighborhood` VARCHAR(191) NULL,
    `empCity` VARCHAR(191) NULL,
    `empState` VARCHAR(191) NULL,
    `empLogo` TEXT NULL,
    `empBanner` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Company_empCnpj_key`(`empCnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `catName` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Preference` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prefCode` VARCHAR(191) NOT NULL,
    `prefName` VARCHAR(191) NOT NULL,
    `prefImg` TEXT NULL,
    `prefDescription` TEXT NULL,
    `prefQtd` INTEGER NULL,
    `prefType` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `companyId` INTEGER NOT NULL,

    UNIQUE INDEX `Preference_prefCode_key`(`prefCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Preference` ADD CONSTRAINT `Preference_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_preferenceId_fkey` FOREIGN KEY (`preferenceId`) REFERENCES `Preference`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
