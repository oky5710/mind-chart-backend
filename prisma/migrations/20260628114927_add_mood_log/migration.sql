/*
  Warnings:

  - You are about to drop the column `hfLog` on the `HrvAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `lfLog` on the `HrvAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `tpLog` on the `HrvAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `vlfLog` on the `HrvAnalysis` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Medication` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[itemSeq]` on the table `Medication` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Medication_name_key";

-- AlterTable
ALTER TABLE "HrvAnalysis" DROP COLUMN "hfLog",
DROP COLUMN "lfLog",
DROP COLUMN "tpLog",
DROP COLUMN "vlfLog";

-- AlterTable
ALTER TABLE "Medication" DROP COLUMN "description",
ADD COLUMN     "chart" TEXT,
ADD COLUMN     "colorClass" TEXT,
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "drugShape" TEXT,
ADD COLUMN     "entpName" TEXT,
ADD COLUMN     "itemImage" TEXT,
ADD COLUMN     "itemSeq" TEXT,
ADD COLUMN     "timings" TEXT[];

-- CreateTable
CREATE TABLE "Exercise" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "date" DATE NOT NULL,
    "type" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "intensity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoffeeLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "type" TEXT,
    "shots" INTEGER,
    "memo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoffeeLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoodLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "date" DATE NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MoodLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MoodLog_userId_date_key" ON "MoodLog"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_itemSeq_key" ON "Medication"("itemSeq");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoffeeLog" ADD CONSTRAINT "CoffeeLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoodLog" ADD CONSTRAINT "MoodLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
