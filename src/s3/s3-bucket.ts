import { Injectable } from "@nestjs/common";
import { extname } from "path";
import type { Express } from "express";
import { randomUUID } from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Bucket {
  private readonly s3Bucket: string;
  private s3UrlKey: string;
  private fileBuffer: Buffer;
  private fileContentType: string;
  constructor(private configService: ConfigService) {
    this.s3Bucket = this.configService.getOrThrow<string>("AWS_S3_BUCKET_NAME");
  }
  public generateUrlKey(file: Express.Multer.File): string {
    this.s3UrlKey = `${randomUUID()}${extname(file.originalname)}`;
    return this.s3UrlKey;
  }
  public readFileBuffer(file: Express.Multer.File): Buffer {
    this.fileBuffer = file.buffer;
    return this.fileBuffer;
  }
  public fileMimeType(file: Express.Multer.File): string {
    this.fileContentType = file.mimetype;
    return this.fileContentType;
  }
  public get bucket(): string {
    return this.s3Bucket;
  }
  public get urlKey(): string {
    return this.s3UrlKey;
  }
  public get buffer() {
    return this.fileBuffer;
  }
  public get mimeType() {
    return this.fileContentType;
  }
}
