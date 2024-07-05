/*
  Warnings:

  - A unique constraint covering the columns `[Email]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `usuarios_Email_key` ON `usuarios`(`Email`);
