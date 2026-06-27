/*
  Warnings:

  - You are about to drop the column `date` on the `HrvAnalysis` table. All the data in the column will be lost.
  - Added the required column `examinedAt` to the `HrvAnalysis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "HrvAnalysis" DROP COLUMN "date",
ADD COLUMN     "examinedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "hospital" TEXT,
ADD COLUMN     "memo" TEXT;
