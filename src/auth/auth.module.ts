import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RefreshToken } from "./entities/refresh-token.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Client } from "src/clients/entities/client.entity";
import { JwtModule } from "@nestjs/jwt";
import { LocalStrategy } from "./strategies/local.strategie";
import { ConfigModule } from "@nestjs/config";
import { JwtStrategy } from "./strategies/jwt.strategie";

@Module({
  imports: [
    TypeOrmModule.forFeature([RefreshToken, Client]),
    JwtModule.register({}),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
