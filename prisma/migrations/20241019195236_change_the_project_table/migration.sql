/*
  Warnings:

  - You are about to drop the column `clone_count` on the `Project` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "PrivacyStatus" AS ENUM ('PUBLIC', 'PRIVATE', 'SHARED');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "clone_count",
ADD COLUMN     "is_cloned" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "privacy_status" "PrivacyStatus" NOT NULL DEFAULT 'PRIVATE';

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_cloned_from_project_id_fkey" FOREIGN KEY ("cloned_from_project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
