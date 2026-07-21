-- Backfill legacy rows (date + durationMinutes only) before requiring startedAt/endedAt.
-- Assumes noon local time for records that never had a precise timestamp.
UPDATE "Exercise"
SET "startedAt" = "date" + INTERVAL '12 hours'
WHERE "startedAt" IS NULL;

UPDATE "Exercise"
SET "endedAt" = "startedAt" + ("durationMinutes" * INTERVAL '1 minute')
WHERE "endedAt" IS NULL;

ALTER TABLE "Exercise" ALTER COLUMN "startedAt" SET NOT NULL;
ALTER TABLE "Exercise" ALTER COLUMN "endedAt" SET NOT NULL;

ALTER TABLE "Exercise" DROP COLUMN "date";
ALTER TABLE "Exercise" DROP COLUMN "durationMinutes";
