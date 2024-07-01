/*
  Warnings:

  - You are about to drop the `Direcciones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Empleados` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Unidades` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Direcciones`;

-- DropTable
DROP TABLE `Empleados`;

-- DropTable
DROP TABLE `Unidades`;

-- DropTable
DROP TABLE `Usuarios`;

-- CreateTable
CREATE TABLE `direcciones` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Calle` VARCHAR(191) NOT NULL,
    `Ciudad` VARCHAR(191) NOT NULL,
    `Estado` VARCHAR(191) NOT NULL,
    `CodigoPostal` VARCHAR(191) NOT NULL,
    `Referencias` VARCHAR(191) NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `empleados` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Direccion` VARCHAR(191) NOT NULL,
    `Telefono` VARCHAR(191) NOT NULL,
    `NombreConyuge` VARCHAR(191) NULL,
    `TelefonoConyuge` VARCHAR(191) NULL,
    `CURP` VARCHAR(191) NOT NULL,
    `RFC` VARCHAR(191) NOT NULL,
    `AptoMedico` DATETIME(3) NOT NULL,
    `Licencia` DATETIME(3) NOT NULL,
    `Tipo` VARCHAR(191) NOT NULL,
    `SueldoSemanal` DOUBLE NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unidades` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `NoEconomico` INTEGER NOT NULL,
    `Placas` VARCHAR(191) NOT NULL,
    `Marca` VARCHAR(191) NOT NULL,
    `Modelo` VARCHAR(191) NOT NULL,
    `Tipo` VARCHAR(191) NOT NULL,
    `VerMecanica` DATETIME(3) NOT NULL,
    `VerContaminantes` DATETIME(3) NOT NULL,
    `VerUS` DATETIME(3) NOT NULL,
    `PolizaUS` DATETIME(3) NOT NULL,
    `PolizaMX` DATETIME(3) NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Accesos` VARCHAR(191) NOT NULL,
    `Administrador` BOOLEAN NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
