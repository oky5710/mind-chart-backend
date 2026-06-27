/*
  Warnings:

  - You are about to drop the `PsychiatricTest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PsychiatricTest" DROP CONSTRAINT "PsychiatricTest_userId_fkey";

-- DropTable
DROP TABLE "PsychiatricTest";

-- CreateTable
CREATE TABLE "HrvAnalysis" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "mhr" DOUBLE PRECISION NOT NULL,
    "sdnn" DOUBLE PRECISION NOT NULL,
    "rmssd" DOUBLE PRECISION NOT NULL,
    "psi" DOUBLE PRECISION NOT NULL,
    "tp" DOUBLE PRECISION NOT NULL,
    "tpLog" DOUBLE PRECISION NOT NULL,
    "vlf" DOUBLE PRECISION NOT NULL,
    "vlfLog" DOUBLE PRECISION NOT NULL,
    "lf" DOUBLE PRECISION NOT NULL,
    "lfLog" DOUBLE PRECISION NOT NULL,
    "hf" DOUBLE PRECISION NOT NULL,
    "hfLog" DOUBLE PRECISION NOT NULL,
    "lfNorm" DOUBLE PRECISION NOT NULL,
    "hfNorm" DOUBLE PRECISION NOT NULL,
    "lfHfRatio" DOUBLE PRECISION NOT NULL,
    "ectopicBeat" DOUBLE PRECISION NOT NULL,
    "srd" DOUBLE PRECISION NOT NULL,
    "result" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HrvAnalysis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HrvAnalysis" ADD CONSTRAINT "HrvAnalysis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
