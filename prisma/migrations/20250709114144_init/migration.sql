/*
  Warnings:

  - Changed the type of `telegramId` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramId",
ADD COLUMN     "telegramId" BIGINT NOT NULL;
