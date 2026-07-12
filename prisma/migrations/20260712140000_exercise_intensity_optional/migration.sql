-- 단축어 자동화는 운동 강도를 알 수 없어 비워둘 수 있게 nullable로 변경
ALTER TABLE "Exercise" ALTER COLUMN "intensity" DROP NOT NULL;
