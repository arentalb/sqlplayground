/*
  Warnings:

  - Added the required column `type` to the `QueryHistory` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QueryType" AS ENUM ('ERROR', 'SUCCESS');

-- AlterTable
ALTER TABLE "QueryHistory" ADD COLUMN     "type" "QueryType" NOT NULL;
