import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { PodcastEntry, PodcastEntryStatus, User } from '@prisma/client';
import {
  getPodcastEntryAudioObjectPath,
  getPodcastEntryImageObjectPath,
  getUserFeedPath,
} from '@server/config';
import { ConfigService } from '@server/config/config.service';
import { DmsService } from '@server/dms/dms.service';
import { PrismaService } from '@server/prisma/prisma.service';
import { PODCASTENTRY_PRISMA_INCLUDES, UserById } from '@shared/interfaces';
import { escapeXml, formatHhMmSsDuration, isPresent } from '@shared/utils';
import axios from 'axios';
import { exec } from 'child_process';
import { isValid, parse } from 'date-fns';
import { createReadStream } from 'fs';
import { trim } from 'lodash';
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
    private readonly configService: ConfigService,
  ) {}

  /**
   * Creates a new podcastEntry.
   *
   * @param podcastEntryCreateDto - The data for the new podcastEntry.
   * @param requestUser - The user creating the podcastEntry.
   * @returns The created podcastEntry.
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
   * Updates an existing podcastEntry.
   *
   * @param podcastEntryUpdateDto - The data to update the podcastEntry with.
   * @param requestUser - The user making the update request.
   * @returns The updated podcastEntry.
   * @throws UnauthorizedException if the user is not allowed to update the podcastEntry.
   * @throws InternalServerErrorException on unknown errors.
   */
  async update(
    podcastEntryUpdateDto: PodcastEntryUpdateDtoType,
    requestUser: UserById,
  ) {
    const podcastEntry = await this.findById(podcastEntryUpdateDto.id);
    if (
      !requestUser.roles?.some((r) => r.name === 'Admin') &&
      podcastEntry.userId !== requestUser.id
    ) {
      throw new UnauthorizedException(
        'You cannot update other users podcastEntry',
      );
    }
    const updatedPodcastEntry = await this.prismaService.podcastEntry.update({
      where: {
        id: podcastEntry.id,
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
    const podcastEntryRecords = await this.prismaService.podcastEntry.findMany({
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

    return podcastEntryRecords;
  }

  /**
   * Finds a podcastEntry by ID.
   *
   * @param id - The ID of the podcastEntry to find.
   * @returns The podcastEntry with the given ID.
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
      const podcastEntry = await this.findById(id);
      if (
        !requestUser.roles?.some((r) => r.name === 'Admin') &&
        podcastEntry?.userId !== requestUser.id
      ) {
        throw new UnauthorizedException(
          'You cannot update other users podcastEntry',
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

  private getYtDlpCmd(subCmd: string): string {
    const socks5ProxyUrl = this.configService.get<string>('SOCKS5_PROXY_URL');
    return `yt-dlp ${socks5ProxyUrl ? `--proxy ${socks5ProxyUrl} --socket-timeout 5` : ''} ${subCmd}`;
  }

  private async getVideoMetadata(url: string): Promise<VideoMetadata> {
    const command = this.getYtDlpCmd(
      `--simulate --print "%(title)s|||%(duration)s|||%(id)s|||%(description)s|||%(uploader)s|||%(upload_date)s" ${url}`,
    );
    const { stdout } = await this.executeCommand(command);

    const data = stdout.split('|||');

    const [title, duration, id, description, author, pubDateRaw] = data;

    const pubDate = parse(pubDateRaw, 'yyyyMMdd', new Date());

    return {
      id: id !== 'N/A' ? id : undefined,
      title: title !== 'N/A' ? title : undefined,
      durationMs:
        duration !== 'N/A' ? parseInt(duration, 10) * 1000 : undefined,
      description: description !== 'N/A' ? description : undefined,
      image:
        id !== 'N/A'
          ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`
          : undefined,
      author: author !== 'N/A' ? author : undefined,
      pubDate: isValid(pubDate) ? pubDate : undefined,
    };
  }

  private async processVideoUrl(
    url: string,
  ): Promise<VideoUrlProcessingResult> {
    const uuid = uuidv4();
    const filepath = `/tmp/${uuid}.mp3`;

    const command = this.getYtDlpCmd(
      `-x --audio-format mp3 --write-description --write-info-json --no-progress --rm-cache-dir -v --extractor-args "youtube:player-client=tv;formats=incomplete" --output ${filepath} ${url}`,
    );

    const { stdout, stderr, error } = await this.executeCommand(command);

    return { filepath, stdout, stderr, error };
  }

  /**
   * Creates a new podcastEntry from a given URL, and uploads the file to the DMS.
   *
   * @param url - The URL of the podcastEntry to create.
   * @param requestUser - The user creating the podcastEntry.
   * @returns The created podcastEntry.
   */
  async createFromUrl(url: string, requestUser: UserById) {
    const startTime = performance.now();

    const podcastEntry = await this.prismaService.podcastEntry.create({
      data: {
        userId: requestUser.id,
        importUrl: url,
        status: PodcastEntryStatus.processing,
      },
    });

    try {
      const videoMetadata = await this.getVideoMetadata(url);

      console.log('videoMetadata', videoMetadata);

      await this.prismaService.podcastEntry.update({
        where: {
          id: podcastEntry.id,
        },
        data: {
          title: videoMetadata.title,
          durationMs: videoMetadata.durationMs,
          pubDate: videoMetadata.pubDate,
          author: videoMetadata.author,
          description: videoMetadata.description,
          metadataFinishedDt: new Date(),
        },
      });

      const { stdout, stderr, error, filepath } =
        await this.processVideoUrl(url);

      console.log('createFromUrl stdout', stdout);
      console.log('createFromUrl stderr', stderr);

      if (error || !filepath) {
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

        return podcastEntry;
      }

      /*
       * Save processing logs.
       */
      await this.prismaService.podcastEntry.update({
        where: {
          id: podcastEntry.id,
        },
        data: {
          processingLog: stdout,
          audioProcessingFinishedDt: new Date(),
        },
      });

      /*
       * Upload audio and image assets to storage.
       */
      const audioObjectPath = getPodcastEntryAudioObjectPath(podcastEntry);
      const imageObjectPath = getPodcastEntryImageObjectPath(podcastEntry);
      const audioObject = await this.dmsService.uploadSingleFile({
        key: audioObjectPath,
        buffer: await this.streamToBuffer(createReadStream(filepath)),
        mimeType: 'audio/mp3',
        isPublic: true,
      });

      let imageObject = undefined;
      if (videoMetadata.image) {
        try {
          const imageStream = await axios.get(videoMetadata.image, {
            responseType: 'stream',
          });
          imageObject = await this.dmsService.uploadSingleFile({
            key: imageObjectPath,
            buffer: await this.streamToBuffer(imageStream.data),
            mimeType: 'image/jpeg',
            isPublic: true,
          });
        } catch (error) {
          console.error(error);
        }
      }
      await this.prismaService.podcastEntry.update({
        where: {
          id: podcastEntry.id,
        },
        data: {
          b2AudioPath: audioObject.key && audioObjectPath,
          b2ImagePath: imageObject?.key ? imageObjectPath : undefined,
          assetUploadFinishedDt: new Date(),
          // Important to update to "ready" here, as the feed will list all "ready" items.
          status: PodcastEntryStatus.ready,
        },
      });

      /*
       * Update user's feed.
       */
      const feedXml = await this.generateUserFeed(requestUser.id);
      await this.dmsService.uploadSingleFile({
        key: getUserFeedPath(requestUser.id),
        buffer: Buffer.from(feedXml, 'utf-8'),
        mimeType: 'application/xml',
        isPublic: true,
      });
      await this.prismaService.podcastEntry.update({
        where: {
          id: podcastEntry.id,
        },
        data: {
          feedUpdateFinishedDt: new Date(),
        },
      });

      /*
       * Update final processing time
       */
      await this.prismaService.podcastEntry.update({
        where: {
          id: podcastEntry.id,
        },
        data: {
          processingTimeMs: performance.now() - startTime,
        },
      });
    } catch (error) {
      /*
       * Save error status.
       */
      await this.prismaService.podcastEntry.update({
        where: {
          id: podcastEntry.id,
        },
        data: {
          status: PodcastEntryStatus.error,
          processingLog: [podcastEntry.processingLog, error?.message]
            .filter(isPresent)
            .join('\n-----\n'),
        },
      });
      // Re-throw error to be handled by caller.
      throw error;
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

  private async generateUserFeed(userId: string): Promise<string> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
    });
    const podcastEntries = await this.prismaService.podcastEntry.findMany({
      where: {
        userId,
        status: PodcastEntryStatus.ready,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return this.generateFeedXml(user, podcastEntries);
  }

  private generateItemXml(podcastEntry: PodcastEntry): string {
    const audioUrl = podcastEntry.b2AudioPath
      ? this.dmsService.getFileUrl(podcastEntry.b2AudioPath)
      : '';
    const imageUrl = podcastEntry.b2ImagePath
      ? this.dmsService.getFileUrl(podcastEntry.b2ImagePath)
      : '';

    return `<item>
      <author>${podcastEntry.author && escapeXml(podcastEntry.author)}</author>
      <itunes:author>${podcastEntry.author && escapeXml(podcastEntry.author)}</itunes:author>
      <title>${podcastEntry.title && escapeXml(podcastEntry.title)}</title>
      <pubDate>${podcastEntry.createdAt.toUTCString()}</pubDate>
      <enclosure url="${audioUrl}" type="audio/mpeg" length="${podcastEntry.durationMs}" />
      <itunes:duration>${podcastEntry.durationMs ? formatHhMmSsDuration(podcastEntry.durationMs / 1000) : ''}</itunes:duration>
      <guid isPermaLink="false">${podcastEntry.id}</guid>
      <itunes:explicit>no</itunes:explicit>
      <description>${podcastEntry.description && escapeXml(podcastEntry.description)}</description>
      <itunes:image href="${imageUrl}" />
      <image href="${imageUrl}" />
    </item>`;
  }

  private generateFeedXml(user: User, podcastEntries: PodcastEntry[]): string {
    const userFirstName = user.firstName && escapeXml(user.firstName);
    const feedTitle = `${userFirstName}'s Podkastify`;
    const podcastImage = `https://fastly.picsum.photos/id/821/200/300.jpg?hmac=-CLZlHMcIt8hXlUFZ4-3AvLYDsUJSwUeTri-zHDlnoA`;

    return trim(`
    <?xml version="1.0" encoding="UTF-8" ?>
      <rss xmlns:googleplay="http://www.google.com/schemas/play-podcasts/1.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:rawvoice="http://www.rawvoice.com/rawvoiceRssModule/" xmlns:content="http://purl.org/rss/1.0/modules/content/" version="2.0">
        <channel>
          <title>${escapeXml(feedTitle)}</title>
          <googleplay:author>${userFirstName}</googleplay:author>
          <rawvoice:rating>TV-G</rawvoice:rating>
          <rawvoice:location>San Francisco, California</rawvoice:location>
          <rawvoice:frequency>Weekly</rawvoice:frequency>
          <author>${userFirstName}</author>
          <email>${escapeXml(user.email)}</email>
          <itunes:author>${userFirstName}</itunes:author>
          <image>
            <url>${podcastImage}</url>
            <title>${escapeXml(feedTitle)}</title>
            <link>https://www.podkastify.com</link>
          </image>
          <itunes:owner>
            <itunes:name>${userFirstName}</itunes:name>
            <itunes:email>${escapeXml(user.email)}</itunes:email>
          </itunes:owner>
          <itunes:keywords>personal</itunes:keywords>
          <copyright>${userFirstName} ${new Date().getFullYear()}</copyright>
          <description>Collection of podcasts by ${userFirstName}</description>
          <googleplay:image href="${podcastImage}" />
          <language>en-us</language>
          <itunes:explicit>no</itunes:explicit>
          <pubDate>${new Date().toUTCString()}</pubDate>
          <link>https://www.podkastify.com</link>
          <itunes:image href="${podcastImage}" />

          ${podcastEntries
            .map((podcastEntry) => this.generateItemXml(podcastEntry))
            .join('')}

        </channel>
      </rss>
    `);
  }

  async getPodcastFeedUrl(user: User): Promise<string> {
    return this.dmsService.getFileUrl(getUserFeedPath(user.id));
  }
}

interface VideoMetadata {
  id: string | undefined;
  title: string | undefined;
  durationMs: number | undefined;
  description: string | undefined;
  image: string | undefined;
  author: string | undefined;
  pubDate: Date | undefined;
}

interface VideoUrlProcessingResult {
  filepath: string;
  stdout: string;
  stderr: string;
  error: string | null;
}
