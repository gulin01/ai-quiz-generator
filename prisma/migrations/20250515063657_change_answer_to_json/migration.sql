/*
  Warnings:

  - You are about to alter the column `answer` on the `Quiz` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Json`.

*/
-- AlterTable
ALTER TABLE `Quiz` MODIFY `answer` JSON NOT NULL;
