/*
  Warnings:

  - You are about to alter the column `status` on the `pedido` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.
  - You are about to drop the column `name` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `token` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nome` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senhaHash` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `token` DROP FOREIGN KEY `token_userId_fkey`;

-- AlterTable
ALTER TABLE `pedido` MODIFY `status` ENUM('ABERTO', 'CONCLUIDO') NOT NULL DEFAULT 'ABERTO';

-- AlterTable
ALTER TABLE `user` DROP COLUMN `name`,
    DROP COLUMN `password`,
    ADD COLUMN `nome` VARCHAR(191) NOT NULL,
    ADD COLUMN `senhaHash` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `token`;

-- CreateTable
CREATE TABLE `produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(191) NOT NULL,
    `precoCents` INTEGER NOT NULL,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedido_produto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `produtoId` INTEGER NOT NULL,
    `quantidade` INTEGER NOT NULL DEFAULT 1,

    UNIQUE INDEX `pedido_produto_pedidoId_produtoId_key`(`pedidoId`, `produtoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedido_produto` ADD CONSTRAINT `pedido_produto_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedido`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pedido_produto` ADD CONSTRAINT `pedido_produto_produtoId_fkey` FOREIGN KEY (`produtoId`) REFERENCES `produto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
