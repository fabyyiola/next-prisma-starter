/*
  Warnings:

  - You are about to drop the `Clientes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Clientes`;

-- CreateTable
CREATE TABLE `clientes` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Calle` VARCHAR(191) NOT NULL,
    `Ciudad` VARCHAR(191) NOT NULL,
    `Estado` VARCHAR(191) NOT NULL,
    `CodigoPostal` VARCHAR(191) NOT NULL,
    `RFC` VARCHAR(191) NOT NULL,
    `RegimenFiscal` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
