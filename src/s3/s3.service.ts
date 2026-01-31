import { Injectable } from "@nestjs/common";
import {
  DeleteObjectCommand,
  PutObjectCommand,
  waitUntilObjectNotExists,
} from "@aws-sdk/client-s3";
import { S3Bucket } from "./s3-bucket";
import { OurS3Client } from "./our-s3-Client";

type UploadType = {
  key: string;
  buffer: Buffer;
  contentType: string;
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

  async updateFile({ key, buffer, contentType }: UploadType) {
    const wasDeleted = await this.delete(key);
    if (!wasDeleted) {
      return null;
    }
    const wasUploaded = await this.upload({ key, buffer, contentType });
    if (!wasUploaded) {
      return null;
    }
    return true;
  }
}
