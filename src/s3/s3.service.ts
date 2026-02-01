import { Injectable } from "@nestjs/common";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { S3Bucket } from "./s3-bucket";
import { OurS3Client } from "./our-s3-Client";
import type { Express } from "express";

type UploadType = {
  key: string;
  buffer: Buffer;
  contentType: string;
};

type UpdateType = {
  newFile: Express.Multer.File;
  oldKey: string;
};

@Injectable()
export class S3Service {
  constructor(
    private s3BucketClient: S3Bucket,
    private s3ClientService: OurS3Client,
  ) {}
  async upload({ key, buffer, contentType }: UploadType) {
    const newUpload = new PutObjectCommand({
      Bucket: this.s3BucketClient.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    try {
      await this.s3ClientService.send(newUpload);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
    return true;
  }
  async delete(key: string) {
    try {
      await this.s3ClientService.send(
        new DeleteObjectCommand({
          Bucket: this.s3BucketClient.bucket,
          Key: key,
        }),
      );
      await waitUntilObjectNotExists(
        { maxWaitTime: 30, client: this.s3ClientService },
        { Bucket: this.s3BucketClient.bucket, Key: key },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
    return true;
  }

  async updateFile({ newFile, oldKey }: UpdateType) {
    const wasDeleted = await this.delete(oldKey);
    if (!wasDeleted) {
      return null;
    }
    const newKey = this.s3BucketClient.generateUrlKey(newFile);
    const wasUploaded = await this.upload({
      key: newKey,
      buffer: this.s3BucketClient.readFileBuffer(newFile),
      contentType: this.s3BucketClient.fileMimeType(newFile),
    });
    if (!wasUploaded) {
      return null;
    }
    return newKey;
  }
}
