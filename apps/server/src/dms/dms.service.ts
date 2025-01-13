import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DmsService {
  private client: S3Client;
  private bucketName = this.configService.get('S3_BUCKET_NAME');

  constructor(private readonly configService: ConfigService) {
    const s3_region = this.configService.get('S3_REGION');

    if (!s3_region) {
      //   this.logger.warn('S3_REGION not found in environment variables');
      throw new Error('S3_REGION not found in environment variables');
    }

    this.client = new S3Client({
      region: s3_region,
      endpoint: this.configService.get('S3_ENDPOINT'),
      credentials: {
        accessKeyId: this.configService.get(
          'S3_ACCESS_KEY',
          'SOMETHING_IS_WRONG',
        ),
        secretAccessKey: this.configService.get(
          'S3_SECRET_ACCESS_KEY',
          'SOMETHING_IS_WRONG',
        ),
      },
      forcePathStyle: true,
    });

    // logger.setContext(DmsService.name);
  }

  /**
   *
   * @param file - The file to be uploaded
   * @returns  A promise that resolves to an object containing the URL and resource type of the
   *   uploaded file.
   */
  async uploadSingleFile({
    key,
    buffer,
    mimeType,
    isPublic = true,
  }: {
    key: string;
    buffer: Buffer;
    mimeType: string;
    isPublic: boolean;
  }) {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: buffer,
        ContentType: mimeType,
        ACL: isPublic ? 'public-read' : 'private',
      });

      const uploadResult = await this.client.send(command);
      // console.log(`File uploaded to S3: ${key} - ${uploadResult.ETag}`);

      // this.logger.debug(
      //   `File uploaded to S3: ${file.originalname} - ${uploadResult.ETag}`,
      // );

      return {
        url: isPublic
          ? (await this.getFileUrl(key)).url
          : (await this.getPresignedSignedUrl(key)).url,
        key,
        isPublic,
        uploadResult,
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async listFiles() {
    try {
      const command = {
        Bucket: this.bucketName,
        Delimiter: '/',
      };

      console.log(command);

      const listObjectsV2Response = await this.client.send(
        new ListObjectsV2Command(command),
      );

      console.log(listObjectsV2Response);

      const files = listObjectsV2Response.Contents?.map((object) => ({
        key: object.Key,
        size: object.Size,
        lastModified: object.LastModified,
      }));

      return files;
    } catch (error) {
      // this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async getFileUrl(key: string) {
    return { url: `https://s3.backblazeb2.com/${this.bucketName}/${key}` };
  }

  async deleteFile(key: string) {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const deleteResult = await this.client.send(command);

      //   this.logger.info(`File deleted from S3: ${key}`);

      return deleteResult;
    } catch (error) {
      // this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * @description Get a signed URL for a file in S3, its not being used in the project, just added for reference
   */
  async getPresignedSignedUrl(key: string) {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.client, command, {
        expiresIn: 60 * 60 * 24, // 24 hours
      });

      return { url };
    } catch (error) {
      // this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async uploadMultiplePublicFiles(files: Express.Multer.File[]) {
    try {
      const uploadPromises = files.map(async (file) => {
        const key = `${uuidv4()}`;

        const command = new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          ACL: 'public-read',
        });

        const uploadResult = await this.client.send(command);

        console.log(
          `File uploaded to S3: ${file.originalname} - ${uploadResult.ETag}`,
        );

        // this.logger.debug(
        //   `File uploaded to S3: ${file.originalname} - ${uploadResult.ETag}`,
        // );

        return {
          url: (await this.getFileUrl(key)).url,
        };
      });

      return Promise.all(uploadPromises);
    } catch (error) {
      // this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }
}
