/*
  Warnings:

  - The `privacy_status` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "privacy_status",
ADD COLUMN     "privacy_status" TEXT NOT NULL DEFAULT 'PRIVATE';

-- DropEnum
DROP TYPE "PrivacyStatus";
