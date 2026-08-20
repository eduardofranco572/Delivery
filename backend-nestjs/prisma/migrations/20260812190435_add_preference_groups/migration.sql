/*
  Warnings:

  - You are about to drop the column `preferenceId` on the `product` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_preferenceId_fkey`;

-- AlterTable
ALTER TABLE `preference` MODIFY `prefType` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `preferenceId`;

-- CreateTable
CREATE TABLE `PreferenceGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `companyId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PreferenceGroupToProduct` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PreferenceGroupToProduct_AB_unique`(`A`, `B`),
    INDEX `_PreferenceGroupToProduct_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PreferenceToPreferenceGroup` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_PreferenceToPreferenceGroup_AB_unique`(`A`, `B`),
    INDEX `_PreferenceToPreferenceGroup_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `PreferenceGroup` ADD CONSTRAINT `PreferenceGroup_companyId_fkey` FOREIGN KEY (`companyId`) REFERENCES `Company`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PreferenceGroupToProduct` ADD CONSTRAINT `_PreferenceGroupToProduct_A_fkey` FOREIGN KEY (`A`) REFERENCES `PreferenceGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PreferenceGroupToProduct` ADD CONSTRAINT `_PreferenceGroupToProduct_B_fkey` FOREIGN KEY (`B`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PreferenceToPreferenceGroup` ADD CONSTRAINT `_PreferenceToPreferenceGroup_A_fkey` FOREIGN KEY (`A`) REFERENCES `Preference`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PreferenceToPreferenceGroup` ADD CONSTRAINT `_PreferenceToPreferenceGroup_B_fkey` FOREIGN KEY (`B`) REFERENCES `PreferenceGroup`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
