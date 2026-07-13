-- 이벤트에 시간도 입력받도록 date를 날짜 전용에서 날짜+시간으로 변경
ALTER TABLE "Event" ALTER COLUMN "date" TYPE TIMESTAMP(3);
