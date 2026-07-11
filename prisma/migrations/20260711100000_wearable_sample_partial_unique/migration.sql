-- 기존 @@unique([userId, type, timestamp])는 userId가 NULL인 동안(인증 붙기 전)에는
-- SQL NULL 비교 규칙상 유일성을 보장하지 못해 재수입 시 중복이 쌓이는 문제가 있었음.
-- userId가 NULL인 행에 한해 (type, timestamp) 유일성을 별도로 강제한다.
CREATE UNIQUE INDEX "WearableSample_type_timestamp_null_user_key"
  ON "WearableSample" (type, timestamp)
  WHERE "userId" IS NULL;
