-- 스키마의 heartRate 필드가 예전에 db push로만 추가되어 마이그레이션 이력에 누락되어 있었음
-- (로컬 개발 DB에는 이미 컬럼이 있으므로 IF NOT EXISTS로 양쪽 다 안전하게 처리)
ALTER TABLE "WearableData" ADD COLUMN IF NOT EXISTS "heartRate" DOUBLE PRECISION;
