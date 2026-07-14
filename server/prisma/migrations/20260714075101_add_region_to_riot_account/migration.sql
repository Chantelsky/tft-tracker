/*
  Warnings:

  - Added the required column `region` to the `RiotAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RiotAccount" ADD COLUMN     "region" TEXT NOT NULL;
