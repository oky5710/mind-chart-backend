-- AlterEnum
-- 기존 RmssdEmotion enum을 긍정/부정 16개 카테고리로 재정의한다. 이 테이블(RmssdEvent)에는
-- 아직 실제 저장된 기록이 없는 것으로 확인해서, 기존 값(특히 사라지는 IRRITATION)을 옮겨줄
-- 데이터 마이그레이션 없이 바로 교체한다.
BEGIN;
CREATE TYPE "RmssdEmotion_new" AS ENUM ('JOY', 'CALM', 'CONFIDENCE', 'EXCITEMENT', 'LOVE', 'GRATITUDE', 'SATISFACTION', 'THRILL', 'ANXIETY', 'DEPRESSION', 'ANGER', 'STRESS', 'FRUSTRATION', 'SADNESS', 'FATIGUE', 'FEAR');
ALTER TABLE "RmssdEvent" ALTER COLUMN "emotion" TYPE "RmssdEmotion_new" USING ("emotion"::text::"RmssdEmotion_new");
ALTER TYPE "RmssdEmotion" RENAME TO "RmssdEmotion_old";
ALTER TYPE "RmssdEmotion_new" RENAME TO "RmssdEmotion";
DROP TYPE "RmssdEmotion_old";
COMMIT;
