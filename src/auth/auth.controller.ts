import {
  Body,
  Controller,
  Delete,
  ParseUUIDPipe,
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
import { JwtDto } from "./dto/jwt-dto";

@Controller()
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(
    @CurrentUser() loginData: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginData);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/auth",
    });

    return { accessToken };
  }

  @Post("auth/refresh")
  async refreshToken(
    @Body("id", new ParseUUIDPipe()) userId: string,
    @Cookies("refreshToken") refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException("Token inválido");
    }
    return await this.authService.refreshToken(userId, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("auth/logout")
  async logout(
    @CurrentUser() jwt: JwtDto,
    @Cookies("refreshToken") refreshToken: string,
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException("Token inválido");
    }
    return await this.authService.logout(jwt.sub, refreshToken);
  }
}
