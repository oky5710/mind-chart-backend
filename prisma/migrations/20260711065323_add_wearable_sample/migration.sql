-- CreateTable
CREATE TABLE "WearableSample" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WearableSample_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WearableSample_type_timestamp_idx" ON "WearableSample"("type", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "WearableSample_userId_type_timestamp_key" ON "WearableSample"("userId", "type", "timestamp");

-- AddForeignKey
ALTER TABLE "WearableSample" ADD CONSTRAINT "WearableSample_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

