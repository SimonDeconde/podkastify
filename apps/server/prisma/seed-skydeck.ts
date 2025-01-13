import { NestFactory } from '@nestjs/core';
import {
  Community,
  Event,
  EventStatus,
  PrismaClient,
  User,
} from '@prisma/client';
import { AppModule } from '@server/app.module';
import { CommunityCreateDtoType } from '@server/community/community.dto';
import { CommunityService } from '@server/community/community.service';
import { EventCreateDtoType } from '@server/podcast-entry/podcast-entry.dto';
import { PodcastEntryService } from '@server/podcast-entry/podcast-entry.service';
import { UserService } from '@server/user/user.service';
import { Roles } from '@shared/interfaces';
import { sleep } from '@shared/utils';
import { LoremIpsum } from 'lorem-ipsum';

const prisma = new PrismaClient();

const getIdSafe = (string: string): string => {
  return string.replace(/\W/g, '-').toLowerCase();
};

const MEMBER_USER_NAMES = [
  { firstName: 'Arina', lastName: 'Bobrova' },
  { firstName: 'Laurence', lastName: 'Cullen' },
  { firstName: 'Riddhi', lastName: 'Khanna' },
  { firstName: 'Alvin', lastName: 'Yates' },
  { firstName: 'Hanson', lastName: 'Chou' },
  { firstName: 'Diego', lastName: 'Chahuan' },
  { firstName: 'Nicolas', lastName: 'Camhi' },
  { firstName: 'Asad', lastName: 'Tirmizi' },
  { firstName: 'Rohit', lastName: 'Hazra' },
  { firstName: 'Deep', lastName: 'Barot' },
  { firstName: 'Vahan', lastName: 'X' },
  { firstName: 'Alex', lastName: 'X' },
  { firstName: 'Andy', lastName: 'Spezzatti' },
  { firstName: 'Taha', lastName: 'Ansari' },
  { firstName: 'Sho', lastName: 'Sugiura' },
  { firstName: 'Amel', lastName: 'Mechalikh' },
  { firstName: 'Chris', lastName: 'Klich' },
  { firstName: 'Alex', lastName: 'Marshall' },
];

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const userService = app.get(UserService);
  const communityService = app.get(CommunityService);
  const eventService = app.get(PodcastEntryService);

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
  // Communities
  // --------------
  const communityRecords: Community[] = [];
  const communities: CommunityCreateDtoType[] = [
    {
      name: "Skydeck '24",
      ticker: 'skydeck-24',
    },
    {
      name: 'INSEAD 15D',
      ticker: 'insead-15d',
    },
  ];

  for (const community of communities) {
    const communityRecord = await communityService.create({
      ...community,
    });
    console.log(
      `Created new community: ${communityRecord.name} (ID: ${communityRecord.id})`,
    );

    communityRecords.push(communityRecord);
  }

  // --------------
  // Users
  // --------------
  const userRecords: User[] = [];
  const admin = await userService.create({
    firstName: 'Admin',
    lastName: 'User',
    email: 'simon.deconde+admin@gmail.com',
    password: 'password',
    roles: [Roles.Admin],
    isVerified: true,
  });
  console.log(`Created new user: ${admin.user.email} (ID: ${admin.user.id})`);
  userRecords.push(admin.user);

  let i = 0;
  for (const member of MEMBER_USER_NAMES) {
    const { firstName, lastName } = member;
    const idSafe = getIdSafe(`${firstName}-${lastName}`);
    const userRecord = await userService.create({
      firstName,
      lastName,
      email: `simon.deconde+user-${i}-${idSafe}@gmail.com`,
      password: 'password',
      linkedInUrl: 'https://www.linkedin.com/in/XYZ/',
      instagram: '@test123',
      twitter: '@test123',
      communityIds: [
        communityRecords[0].id,
        // Special case for Arina... part of 2 communities.
        ...(firstName === 'Arina' ? [communityRecords[1].id] : []),
      ],
      roles: [Roles.User],
      isVerified: true,
    });
    console.log(
      `Created new user: ${userRecord.user.email} (ID: ${userRecord.user.id})`,
    );

    userRecords.push(userRecord.user);
    i += 1;
  }

  // --------------
  // Events
  // --------------
  const eventRecords: Event[] = [];
  const events: EventCreateDtoType[] = [
    {
      name: "Sho's dinner (restaurant)",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[15].id,
      description: "Let's meet at my favorite local Japanese restaurant!",
      address: '123 Main st, Berkeley, CA 94704',
      fromDt: new Date('2024-07-14T18:00:00'),
      toDt: new Date('2024-07-14T23:00:00'),
      status: EventStatus.pending,
      minGuests: 2,
      maxGuests: 8,
    },
    {
      name: "Laurence's dinner",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[2].id,
      description: lorem.generateParagraphs(2),
      address: '123 Main st, Berkeley, CA 94704',
      fromDt: new Date('2024-07-28T18:00:00'),
      toDt: new Date('2024-07-28T23:00:00'),
      status: EventStatus.pending,
      minGuests: 1,
      maxGuests: 4,
    },
    {
      name: "Asad's dinner",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[8].id,
      description: lorem.generateParagraphs(2),
      address: '456 Main st, San Francisco, CA 94109',
      fromDt: new Date('2024-07-11T18:00:00'),
      toDt: new Date('2024-07-11T23:00:00'),
      status: EventStatus.pending,
      minGuests: 2,
      maxGuests: 6,
    },
    {
      name: "Chris' dinner",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[17].id,
      description: lorem.generateParagraphs(2),
      address: '789 Main st, Berkeley, CA 94109',
      fromDt: new Date('2024-07-06T18:00:00'),
      toDt: new Date('2024-07-06T23:00:00'),
      status: EventStatus.pending,
      minGuests: 3,
      maxGuests: 10,
    },
    {
      name: "Riddhi's dinner",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[3].id,
      description: lorem.generateParagraphs(2),
      address: '789 Main st, Berkeley, CA 94109',
      fromDt: new Date('2024-07-21T18:00:00'),
      toDt: new Date('2024-07-21T23:00:00'),
      status: EventStatus.pending,
      minGuests: 1,
      maxGuests: 6,
    },
    {
      name: "Arina's dinner #1",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[1].id,
      description: lorem.generateParagraphs(2),
      address: '8 Juri st, San Francisco, CA 94110',
      fromDt: new Date('2024-07-01T18:00:00'),
      toDt: new Date('2024-07-01T23:00:00'),
      status: EventStatus.pending,
      minGuests: 2,
      maxGuests: 8,
    },
    {
      name: "Arina's dinner #2",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[1].id,
      description: lorem.generateParagraphs(2),
      address: '8 Juri st, San Francisco, CA 94110',
      fromDt: new Date('2024-07-08T18:00:00'),
      toDt: new Date('2024-07-08T23:00:00'),
      status: EventStatus.pending,
      minGuests: 2,
      maxGuests: 8,
    },
    {
      name: "Arina's dinner #3",
      communityId: communityRecords[0].id,
      hostUserId: userRecords[1].id,
      description: lorem.generateParagraphs(2),
      address: '8 Juri st, San Francisco, CA 94110',
      fromDt: new Date('2024-07-15T18:00:00'),
      toDt: new Date('2024-07-15T23:00:00'),
      status: EventStatus.pending,
      minGuests: 2,
      maxGuests: 8,
    },
    {
      name: "Arina's dinner #4 for INSEAD!",
      communityId: communityRecords[1].id,
      hostUserId: userRecords[1].id,
      description: 'This is a dinner for INSEAD 15D people!',
      address: '8 Juri st, San Francisco, CA 94110',
      fromDt: new Date('2024-07-10T18:00:00'),
      toDt: new Date('2024-07-10T23:00:00'),
      status: EventStatus.pending,
      minGuests: 1,
      maxGuests: 10,
    },
  ];

  await Promise.all(
    events.map(async (event) => {
      const eventRecord = await eventService.create({
        ...event,
      });
      console.log(
        `Created new event: ${eventRecord.name} (ID: ${eventRecord.id})`,
      );

      eventRecords.push(eventRecord);
    }),
  );

  console.log(`Created ${eventRecords.length} events. Inviting guests...`);

  // Have to loop 1 by 1 so that we can apply some "fairness".
  for (const event of eventRecords) {
    await eventService.inviteRandomGuests({ id: event.id });
    await sleep(1000);
    console.log(`Invited guests to event: ${event.name} (ID: ${event.id})`);
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
