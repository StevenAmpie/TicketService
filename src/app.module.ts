import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AgentsModule } from "./agents/agents.module";
import { ClientsModule } from "./clients/clients.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { S3Module } from "./s3/s3.module";
import { TicketsModule } from "./tickets/tickets.module";
import awsConfig from "./config/aws.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [awsConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    AgentsModule,
    ClientsModule,
    S3Module,
    TicketsModule,
  ],
  controllers: [],
})
export class AppModule {}
