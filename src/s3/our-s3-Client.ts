import { Injectable } from "@nestjs/common";
import { S3Client } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class OurS3Client extends S3Client {
  constructor(private readonly configService: ConfigService) {
    super({
      region: configService.getOrThrow("AWS_REGION"),
      credentials: {
        accessKeyId: configService.getOrThrow("AWS_ACCESS_KEY_ID"),
        secretAccessKey: configService.getOrThrow("AWS_SECRET_ACCESS_KEY"),
      },
    });
  }
}
