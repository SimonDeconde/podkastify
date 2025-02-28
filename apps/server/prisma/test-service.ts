import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '@server/app.module';
import { PodcastEntryService } from '@server/podcast-entry/podcast-entry.service';
import { PrismaService } from '@server/prisma/prisma.service';

const prisma = new PrismaClient();

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prismaService = app.get(PrismaService);
  const podcastEntryService = app.get(PodcastEntryService);

  const podcastEntry = await prismaService.podcastEntry.findFirst();

  if (podcastEntry) {
    // Do something better here. At the time of writing this, the findById is the only
    // safe method to replace here.
    podcastEntryService.findById(podcastEntry.id);
  }

  await app.close();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
