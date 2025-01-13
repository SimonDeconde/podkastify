import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PodcastEntryStatus } from '@prisma/client';
import { DmsService } from '@server/dms/dms.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { PODCASTENTRY_PRISMA_INCLUDES, UserById } from '@shared/interfaces';
import { exec } from 'child_process';
import { createReadStream } from 'fs';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';
import {
  PodcastEntryCreateDtoType,
  PodcastEntryUpdateDtoType,
} from './podcast-entry.dto';

@Injectable()
/**
 * PodcastEntryService handles CRUD operations for PodcastEntries.
 *
 * Provides methods for creating, updating, finding, deleting PodcastEntries.
 */
export class PodcastEntryService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly dmsService: DmsService,
  ) {}

  /**
   * Creates a new podcastentry.
   *
   * @param podcastentryCreateDto - The data for the new podcastentry.
   * @param requestUser - The user creating the podcastentry.
   * @returns The created podcastentry.
   */
  async create(
    podcastEntryCreateDto: PodcastEntryCreateDtoType,
    requestUser: UserById,
  ) {
    const podcastEntry = await this.prismaService.podcastEntry.create({
      data: {
        ...podcastEntryCreateDto,
        userId: requestUser.id,
        status: PodcastEntryStatus.pending,
      },
    });

    return podcastEntry;
  }

  /**
   * Updates an existing podcastentry.
   *
   * @param podcastEntryUpdateDto - The data to update the podcastentry with.
   * @param requestUser - The user making the update request.
   * @returns The updated podcastentry.
   * @throws UnauthorizedException if the user is not allowed to update the podcastentry.
   * @throws InternalServerErrorException on unknown errors.
   */
  async update(
    podcastEntryUpdateDto: PodcastEntryUpdateDtoType,
    requestUser: UserById,
  ) {
    const podcastentry = await this.findById(podcastEntryUpdateDto.id);
    if (
      !requestUser.roles?.some((r) => r.name === 'Admin') &&
      podcastentry.userId !== requestUser.id
    ) {
      throw new UnauthorizedException(
        'You cannot update other users podcastentry',
      );
    }
    const updatedPodcastEntry = await this.prismaService.podcastEntry.update({
      where: {
        id: podcastentry.id,
      },
      data: { ...podcastEntryUpdateDto },
    });
    return updatedPodcastEntry;
  }

  /**
   * Finds podcastEntries where current user is the host or current has an invitation.
   *
   * @returns A list of podcastEntries.
   */
  async findUserPodcastEntries(requestUser: UserById) {
    const podcastentryRecords = await this.prismaService.podcastEntry.findMany({
      include: {
        ...PODCASTENTRY_PRISMA_INCLUDES,
      },
      where: {
        userId: requestUser.id,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return podcastentryRecords;
  }

  /**
   * Finds a podcastentry by ID.
   *
   * @param id - The ID of the podcastentry to find.
   * @returns The podcastentry with the given ID.
   */
  async findById(id: string) {
    return this.prismaService.podcastEntry.findFirstOrThrow({
      where: { id },
      include: {
        ...PODCASTENTRY_PRISMA_INCLUDES,
      },
    });
  }

  /**
   * Removes one or more podcastEntries by ID.
   *
   * Accepts a single podcastEntry ID or an array of podcastEntry IDs.
   * Checks if the requesting user is allowed to delete the podcastEntry.
   * Marks the podcastEntries as deleted by setting deletedAt.
   *
   * @param id - The ID or IDs of the podcastEntries to delete.
   * @param requestUser - The requesting user.
   * @returns The updated podcastEntries.
   */
  async remove(id: string | string[], requestUser: UserById) {
    let ids: string[] = [];
    if (id instanceof Array) {
      ids = id;
    } else if (typeof id === 'string') {
      ids = [id];
    }
    const output = [];
    for (const id of ids) {
      const podcastentry = await this.findById(id);
      if (
        !requestUser.roles?.some((r) => r.name === 'Admin') &&
        podcastentry?.userId !== requestUser.id
      ) {
        throw new UnauthorizedException(
          'You cannot update other users podcastentry',
        );
      }
      output.push(
        await this.prismaService.podcastEntry.delete({
          where: {
            id,
          },
        }),
      );
    }
    return output;
  }

  /**
   * Creates a new podcastentry from a given URL, and uploads the file to the DMS.
   *
   * @param url - The URL of the podcastentry to create.
   * @param requestUser - The user creating the podcastentry.
   * @returns The created podcastentry.
   */
  async createFromUrl(url: string, requestUser: UserById) {
    const uuid = uuidv4();
    const filename = `${uuid}.mp3`;
    const filepath = `/tmp/${filename}`;
    const command = `yt-dlp -x --audio-format mp3 --write-description --write-info-json --no-progress --output ${filepath} ${url}`;

    const podcastEntry = await this.prismaService.podcastEntry.create({
      data: {
        userId: requestUser.id,
        importUrl: url,
        status: PodcastEntryStatus.pending,
        title: uuid,
        pubDate: new Date(),
        description: 'Imported from URL',
      },
    });

    await new Promise((resolve, reject) => {
      // Run command.
      exec(command, async (error, stdout, stderr) => {
        await this.prismaService.podcastEntry.update({
          where: {
            id: podcastEntry.id,
          },
          data: {
            status: PodcastEntryStatus.processing,
          },
        });

        console.log('stdout', stdout);
        console.log('stderr', stderr);

        if (error) {
          console.error(`exec error: ${error}`);

          await this.prismaService.podcastEntry.update({
            where: {
              id: podcastEntry.id,
            },
            data: {
              status: PodcastEntryStatus.error,
              processingLog: error.message,
            },
          });

          reject(error);
          return;
        }
        // const filename = stdout.trim().split('\n').pop();
        // if (!filename) {
        //   console.error('No file generated');
        //   reject(new Error('No file generated'));
        //   return;
        // }
        const buffer = await this.streamToBuffer(createReadStream(filepath));

        await this.prismaService.podcastEntry.update({
          where: {
            id: podcastEntry.id,
          },
          data: {
            processingLog: stdout,
            // TODO: update this!
            processingTimeMs: 123456,
          },
        });

        await this.dmsService.uploadSingleFile({
          key: filename,
          buffer,
          mimeType: 'audio/mp3',
          isPublic: true,
        });

        await this.prismaService.podcastEntry.update({
          where: {
            id: podcastEntry.id,
          },
          data: {
            b2Path: filename,
            status: PodcastEntryStatus.ready,
            url: `https://f005.backblazeb2.com/file/dev-podkastify/${filename}`,
          },
        });

        resolve(true);
      });
    });

    return podcastEntry;
  }

  streamToBuffer(readStream: Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      readStream.on('data', (chunk) => {
        chunks.push(Buffer.from(chunk));
      });

      readStream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });

      readStream.on('error', (err) => {
        reject(err);
      });
    });
  }
}
