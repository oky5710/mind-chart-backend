-- 메인 화면 아침/취침 퀵버튼에서 시간대별로 복용 기록을 남길 수 있도록 timing/takenAt 추가
-- dosage는 퀵버튼 흐름에서 입력받지 않으므로 선택값으로 변경
ALTER TABLE "MedicationLog" ADD COLUMN "timing" TEXT;
ALTER TABLE "MedicationLog" ADD COLUMN "takenAt" TIMESTAMP(3);
ALTER TABLE "MedicationLog" ALTER COLUMN "dosage" DROP NOT NULL;

DROP INDEX IF EXISTS "MedicationLog_userId_medicationId_date_key";
CREATE UNIQUE INDEX "MedicationLog_userId_medicationId_date_timing_key" ON "MedicationLog"("userId", "medicationId", "date", "timing");
