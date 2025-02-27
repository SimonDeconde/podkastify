/*
  Warnings:

  - You are about to drop the column `b2Path` on the `PodcastEntry` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `PodcastEntry` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `PodcastEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PodcastEntry" DROP COLUMN "b2Path",
DROP COLUMN "image",
DROP COLUMN "url",
ADD COLUMN     "assetUploadFinishedDt" TIMESTAMP(3),
ADD COLUMN     "audioProcessingFinishedDt" TIMESTAMP(3),
ADD COLUMN     "b2AudioPath" TEXT,
ADD COLUMN     "b2ImagePath" TEXT,
ADD COLUMN     "feedUpdateFinishedDt" TIMESTAMP(3),
ADD COLUMN     "imageProcessingFinishedDt" TIMESTAMP(3);
