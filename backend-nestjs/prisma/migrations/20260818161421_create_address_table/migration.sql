/*
  Warnings:

  - You are about to drop the column `userAddress` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userCity` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userNeighborhood` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userState` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `userStreet` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `userAddress`,
    DROP COLUMN `userCity`,
    DROP COLUMN `userNeighborhood`,
    DROP COLUMN `userState`,
    DROP COLUMN `userStreet`;

-- CreateTable
CREATE TABLE `Address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `street` VARCHAR(191) NOT NULL,
    `number` VARCHAR(191) NOT NULL,
    `neighborhood` VARCHAR(191) NOT NULL,
    `city` VARCHAR(191) NOT NULL,
    `state` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Address` ADD CONSTRAINT `Address_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
