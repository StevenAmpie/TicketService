import { Global, Module } from "@nestjs/common";
import { S3Service } from "./s3.service";
import { S3Bucket } from "./s3-bucket";
import { OurS3Client } from "./our-s3-Client";
@Global()
@Module({
  providers: [S3Service, S3Bucket, OurS3Client],
  exports: [S3Service, S3Bucket],
})
export class S3Module {}
