/*
  Warnings:

  - You are about to drop the column `owner` on the `PodcastEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PodcastEntry" DROP COLUMN "owner",
ADD COLUMN     "metadataFinishedDt" TIMESTAMP(3);
