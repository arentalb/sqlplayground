/*
  Warnings:

  - Added the required column `database_name` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "database_name" TEXT NOT NULL;
