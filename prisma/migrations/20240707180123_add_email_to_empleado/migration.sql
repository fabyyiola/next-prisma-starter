/*
  Warnings:

  - Added the required column `Email` to the `empleados` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `empleados` ADD COLUMN `Email` VARCHAR(191) NOT NULL;
