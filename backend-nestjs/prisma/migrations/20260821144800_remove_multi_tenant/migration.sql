/*
  Warnings:

  - You are about to drop the column `companyId` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `preference` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `preferencegroup` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `companyId` on the `user` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `category` DROP FOREIGN KEY `Category_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `Order_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `preference` DROP FOREIGN KEY `Preference_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `preferencegroup` DROP FOREIGN KEY `PreferenceGroup_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `product` DROP FOREIGN KEY `Product_companyId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_companyId_fkey`;

-- AlterTable
ALTER TABLE `category` DROP COLUMN `companyId`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `companyId`;

-- AlterTable
ALTER TABLE `preference` DROP COLUMN `companyId`;

-- AlterTable
ALTER TABLE `preferencegroup` DROP COLUMN `companyId`;

-- AlterTable
ALTER TABLE `product` DROP COLUMN `companyId`;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `companyId`;
