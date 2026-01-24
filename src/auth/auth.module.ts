import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { RefreshToken } from "./entities/refresh-token.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([RefreshToken])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
