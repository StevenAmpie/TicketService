import { Injectable } from "@nestjs/common";
import { extname } from "path";
import type { Express } from "express";
import { randomUUID } from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Bucket {
  private readonly s3Bucket: string;
  constructor(private configService: ConfigService) {
    this.s3Bucket = this.configService.getOrThrow<string>("AWS_S3_BUCKET_NAME");
  }
  public generateUrlKey(file: Express.Multer.File): string {
    return `${randomUUID()}${extname(file.originalname)}`;
  }
  public readFileBuffer(file: Express.Multer.File): Buffer {
    return file.buffer;
  }
  public fileMimeType(file: Express.Multer.File): string {
    return file.mimetype;
  }
  public get bucket(): string {
    return this.s3Bucket;
  }
}
