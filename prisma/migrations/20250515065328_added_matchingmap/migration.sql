/*
  Warnings:

  - You are about to drop the column `marchingMap` on the `Quiz` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Quiz` DROP COLUMN `marchingMap`,
    ADD COLUMN `matchingMap` JSON NULL;
