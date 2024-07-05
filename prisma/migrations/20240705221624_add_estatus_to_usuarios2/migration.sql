/*
  Warnings:

  - Added the required column `Estatus` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `Estatus` VARCHAR(191) NOT NULL;
