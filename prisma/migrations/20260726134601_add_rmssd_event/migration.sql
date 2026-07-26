-- CreateEnum
CREATE TYPE "RmssdDirection" AS ENUM ('LOW', 'HIGH');

-- CreateEnum
CREATE TYPE "RmssdEmotion" AS ENUM ('ANXIETY', 'STRESS', 'IRRITATION', 'SADNESS', 'FATIGUE', 'CALM', 'JOY');

-- CreateTable
CREATE TABLE "RmssdEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "rmssdValue" DOUBLE PRECISION NOT NULL,
    "direction" "RmssdDirection" NOT NULL,
    "emotion" "RmssdEmotion" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RmssdEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RmssdEvent" ADD CONSTRAINT "RmssdEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
