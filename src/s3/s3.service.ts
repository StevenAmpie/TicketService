import { Injectable } from "@nestjs/common";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { S3Bucket } from "./s3-bucket";
import { OurS3Client } from "./our-s3-Client";

type UploadTypes = {
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
  async upload({ key, buffer, contentType }: UploadTypes) {
    const newUpload = new PutObjectCommand({
      Bucket: this.s3BucketClient.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });
    return await this.s3ClientService.send(newUpload);
  }
}
