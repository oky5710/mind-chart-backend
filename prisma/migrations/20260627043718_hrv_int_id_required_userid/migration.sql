/*
  Warnings:

  - The primary key for the `HrvAnalysis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `HrvAnalysis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `userId` on table `HrvAnalysis` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "HrvAnalysis" DROP CONSTRAINT "HrvAnalysis_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "userId" SET NOT NULL,
ADD CONSTRAINT "HrvAnalysis_pkey" PRIMARY KEY ("id");
