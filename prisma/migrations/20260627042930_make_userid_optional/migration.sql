-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "HrvAnalysis" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MedicationChange" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MedicationLog" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WearableData" ALTER COLUMN "userId" DROP NOT NULL;
