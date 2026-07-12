-- Event 테이블은 아직 데이터가 없어서 안전하게 enum을 교체함
ALTER TYPE "EventType" RENAME TO "EventType_old";
CREATE TYPE "EventType" AS ENUM ('MEDICATION_CHANGE', 'RELATIONSHIP_ISSUE', 'WORK_STRESS', 'OTHER');
ALTER TABLE "Event" ALTER COLUMN "type" TYPE "EventType" USING ("type"::text::"EventType");
DROP TYPE "EventType_old";

-- 유형/설명만 필수로 받고, 감정/강도는 입력받지 않으므로 선택값으로 변경
ALTER TABLE "Event" ALTER COLUMN "sentiment" DROP NOT NULL;
ALTER TABLE "Event" ALTER COLUMN "intensity" DROP NOT NULL;
