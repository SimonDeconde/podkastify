import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '@server/app.module';
import { PodcastEntryService } from '@server/podcast-entry/podcast-entry.service';
import { PrismaService } from '@server/prisma/prisma.service';

const prisma = new PrismaClient();

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const prismaService = app.get(PrismaService);
  const eventService = app.get(PodcastEntryService);

  const event = await prismaService.event.findFirst();

  if (event) {
    eventService.invite({ id: event.id });
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
