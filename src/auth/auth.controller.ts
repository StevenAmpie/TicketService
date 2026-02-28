import {
  Controller,
  Delete,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LoginDto } from "./dto/login-dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import type { Response } from "express";
import { Cookies } from "src/decorators/cookies.decorator";
import { CurrentUser } from "src/decorators/getCurrentUser.decorator";

@Controller()
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@CurrentUser() loginData: LoginDto) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginData);

    return { success: true, status: 200, accessToken, refreshToken };
  }

  @Post("auth/refresh")
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Cookies("refreshToken") refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh-Token inválido");
    }
    const newAccessToken = await this.authService.refreshToken(refreshToken);

    return { accessToken: newAccessToken.accessToken };
  }

  @UseGuards(JwtAuthGuard)
  @Delete("auth/logout")
  async logout(@Cookies("refreshToken") refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException("Token inválido");
    }
    return await this.authService.logout(refreshToken);
  }
}
