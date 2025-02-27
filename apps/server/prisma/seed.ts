import { NestFactory } from '@nestjs/core';
import { PodcastEntry, PrismaClient, User } from '@prisma/client';
import { AppModule } from '@server/app.module';
import { PodcastEntryCreateDtoType } from '@server/podcast-entry/podcast-entry.dto';
import { PodcastEntryService } from '@server/podcast-entry/podcast-entry.service';
import { UserService } from '@server/user/user.service';
import { Roles } from '@shared/interfaces';
import { range } from 'lodash';

const prisma = new PrismaClient();

const NUM_MEMBERS = 20;

const MEMBER_USER_NAMES = [
  { firstName: 'Fun', lastName: 'Cat' },
  { firstName: 'Happy', lastName: 'Dolphin' },
  { firstName: 'Energetic', lastName: 'Giraffe' },
  { firstName: 'Slow', lastName: 'Badger' },
  { firstName: 'Hungry', lastName: 'Flamingo' },
  { firstName: 'Realistic', lastName: 'Crocodile' },
  { firstName: 'Tired', lastName: 'Antelope' },
  { firstName: 'Perfumed', lastName: 'Lion' },
  { firstName: 'Soft', lastName: 'Tiger' },
  { firstName: 'Audacious', lastName: 'Bear' },
  { firstName: 'Confused', lastName: 'Cuttlefish' },
  { firstName: 'Wild', lastName: 'Octopus' },
  { firstName: 'Intentional', lastName: 'Snake' },
  { firstName: 'Fast', lastName: 'Crab' },
  { firstName: 'Tricky', lastName: 'Lizard' },
  { firstName: 'Contemplative', lastName: 'Parrot' },
  { firstName: 'Interesting', lastName: 'Sparrow' },
  { firstName: 'Aggravated', lastName: 'Owl' },
  { firstName: 'Sneaky', lastName: 'Turtle' },
  { firstName: 'Peaceful', lastName: 'Eel' },
];

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const podcastEntryService = app.get(PodcastEntryService);

  // --------------
  // Roles
  // --------------
  const adminRole = await prisma.role.create({
    data: {
      name: 'Admin',
    },
  });
  console.log(`Created new role: ${adminRole.name} (ID: ${adminRole.id})`);
  const userRole = await prisma.role.create({
    data: {
      name: 'User',
    },
  });
  console.log(`Created new role: ${userRole.name} (ID: ${userRole.id})`);

  // --------------
  // Users
  // --------------
  const userRecords: User[] = [];
  const admin = await userService.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'simon.deconde+admin@gmail.com',
    password: 'password',
    isVerified: true,
    roles: [Roles.Admin],
  });
  console.log(`Created new user: ${admin.user.email} (ID: ${admin.user.id})`);
  userRecords.push(admin.user);

  await Promise.all(
    range(NUM_MEMBERS).map(async (i) => {
      const userRecord = await userService.create({
        firstName: MEMBER_USER_NAMES[i].firstName,
        lastName: MEMBER_USER_NAMES[i].lastName,
        email: `simon.deconde+user-${i}@podkastify.com`,
        password: 'password',
        roles: [Roles.User],
      });
      console.log(
        `Created new user: ${userRecord.user.email} (ID: ${userRecord.user.id})`,
      );

      userRecords.push(userRecord.user);
    }),
  );

  // --------------
  // Podcast Entries
  // --------------
  const podcastEntryRecords: PodcastEntry[] = [];
  const podcastEntries: PodcastEntryCreateDtoType[] = [
    {
      importUrl: 'https://anchor.fm/simon-deconde/podkastify-episode-1',
    },
  ];

  await Promise.all(
    podcastEntries.map(async (podcastEntry) => {
      const podcastEntryRecord = await podcastEntryService.create(
        {
          ...podcastEntry,
        },
        userRecords[0],
      );
      console.log(
        `Created new podcast entry: ${podcastEntryRecord.title} (ID: ${podcastEntryRecord.id})`,
      );

      podcastEntryRecords.push(podcastEntryRecord);
    }),
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
