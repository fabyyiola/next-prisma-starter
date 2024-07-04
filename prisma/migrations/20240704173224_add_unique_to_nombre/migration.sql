/*
  Warnings:

  - A unique constraint covering the columns `[Nombre]` on the table `regimenFiscal` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `regimenFiscal_Nombre_key` ON `regimenFiscal`(`Nombre`);
