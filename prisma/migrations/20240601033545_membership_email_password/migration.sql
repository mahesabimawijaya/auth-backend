/*
  Warnings:

  - You are about to drop the column `password` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Membership` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Membership` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Membership` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `membership` ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `password`;

-- CreateIndex
CREATE UNIQUE INDEX `Membership_email_key` ON `Membership`(`email`);
