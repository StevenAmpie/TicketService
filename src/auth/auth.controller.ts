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
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000,
      path: "/",
    });

    return { success: true, status: 200 };
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

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
    });

    return { success: true, status: 200 };
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
