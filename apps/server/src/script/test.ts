import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from '@server/app.module';
import { PodcastEntryService } from '@server/podcast-entry/podcast-entry.service';
import { UserService } from '@server/user/user.service';

const prisma = new PrismaClient();

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const podcastEntryService = app.get(PodcastEntryService);

  const user = await userService.findById(
    '772e3440-d646-4365-bb0f-06b662bac4f0',
  );

  if (!user) {
    throw new Error('User not found');
  }

  await podcastEntryService.createFromUrl(
    // Short video
    // 'https://www.youtube.com/watch?v=Oj4cMlFSXTU',
    // Long video
    'https://www.youtube.com/watch?v=XzyFQTvjAiw',
    user,
  );

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
