-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('user', 'researcher', 'admin');

-- AlterTable
ALTER TABLE "User"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'user';

-- 운영 정책상 admin은 소유자 계정 하나만 허용한다.
CREATE UNIQUE INDEX "User_single_admin_key"
ON "User" ("role")
WHERE "role" = 'admin';
