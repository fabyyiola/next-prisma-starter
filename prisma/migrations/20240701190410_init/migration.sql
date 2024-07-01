-- CreateTable
CREATE TABLE `Clientes` (
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

-- CreateTable
CREATE TABLE `Direcciones` (
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
CREATE TABLE `Empleados` (
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
CREATE TABLE `Unidades` (
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
CREATE TABLE `Usuarios` (
    `ID` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombre` VARCHAR(191) NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `Accesos` VARCHAR(191) NOT NULL,
    `Administrador` BOOLEAN NOT NULL,

    PRIMARY KEY (`ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
