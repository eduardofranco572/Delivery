/*
  Warnings:

  - Made the column `empFreteBase` on table `company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `company` MODIFY `empFreteBase` DECIMAL(65, 30) NOT NULL;
