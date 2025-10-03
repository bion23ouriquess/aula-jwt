/*
  Warnings:

  - You are about to drop the `pedidos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `pedidos` DROP FOREIGN KEY `pedidos_userId_fkey`;

-- DropTable
DROP TABLE `pedidos`;

-- CreateTable
CREATE TABLE `pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `valor` DECIMAL(65, 30) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `pedido` ADD CONSTRAINT `pedido_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
