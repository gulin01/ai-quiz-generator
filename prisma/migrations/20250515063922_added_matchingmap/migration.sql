-- AlterTable
ALTER TABLE `Quiz` ADD COLUMN `marchingMap` JSON NULL,
    MODIFY `answer` VARCHAR(191) NOT NULL;
