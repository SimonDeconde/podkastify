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

const SOCKS5_PROXY_URL =
  'socks5h://user-sp2yo7oa53-session-1:YihOtT2q2gx=95vTri@gate.smartproxy.com:7000';

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
        createdAt: 'desc',
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

  private async getVideoMetadata(url: string): Promise<string[]> {
    const command = `yt-dlp --proxy ${SOCKS5_PROXY_URL} --socket-timeout 5 --simulate --print "%(title)s|||%(duration)s" ${url}`;
    const { stdout } = await this.executeCommand(command);

    const data = stdout.split('|||');
    console.log('getVideoMetadata data', data);

    return data;
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
    const command = `yt-dlp --proxy ${SOCKS5_PROXY_URL} --socket-timeout 5 -x --audio-format mp3 --write-description --write-info-json --no-progress --rm-cache-dir -v --extractor-args "youtube:player-client=tv;formats=incomplete" --output ${filepath} ${url}`;

    // 198.23.239.134:6540: PO required

    const videoMetadata = await this.getVideoMetadata(url);

    const podcastEntry = await this.prismaService.podcastEntry.create({
      data: {
        userId: requestUser.id,
        importUrl: url,
        status: PodcastEntryStatus.pending,
        title: videoMetadata[0],
        durationMs: parseInt(videoMetadata[1], 10) * 1000,
        pubDate: new Date(),
        description: 'Imported from URL',
      },
    });

    const { stdout, stderr, error } = await this.executeCommand(command);

    await this.prismaService.podcastEntry.update({
      where: {
        id: podcastEntry.id,
      },
      data: {
        status: PodcastEntryStatus.processing,
      },
    });

    console.log('createFromUrl stdout', stdout);
    console.log('createFromUrl stderr', stderr);

    if (error) {
      console.error(`exec error: ${error}`);

      await this.prismaService.podcastEntry.update({
        where: {
          id: podcastEntry.id,
        },
        data: {
          status: PodcastEntryStatus.error,
          processingLog: error,
        },
      });
    } else {
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
    }
    return podcastEntry;
  }

  private async executeCommand(
    command: string,
  ): Promise<{ stdout: string; stderr: string; error: string | null }> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr, error });
        }
      });
    });
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
