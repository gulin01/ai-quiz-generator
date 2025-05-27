/*
  Warnings:

  - You are about to drop the column `storyId` on the `Unit` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[unitId]` on the table `Story` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Unit` DROP FOREIGN KEY `Unit_storyId_fkey`;

-- DropIndex
DROP INDEX `Unit_storyId_fkey` ON `Unit`;

-- AlterTable
ALTER TABLE `Story` ADD COLUMN `unitId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Unit` DROP COLUMN `storyId`;

-- CreateIndex
CREATE UNIQUE INDEX `Story_unitId_key` ON `Story`(`unitId`);

-- CreateIndex
CREATE INDEX `Story_unitId_fkey` ON `Story`(`unitId`);

-- AddForeignKey
ALTER TABLE `Story` ADD CONSTRAINT `Story_unitId_fkey` FOREIGN KEY (`unitId`) REFERENCES `Unit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
