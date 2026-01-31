import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { LoginDto } from "./dto/login-dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller()
export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post("refresh")
  refreshToken(@Body() body: { userId: string; token: string }) {
    return this.authService.refreshToken(body.userId, body.token);
  }

  @UseGuards(JwtAuthGuard)
  @Delete("logout")
  logout(@Body() body: { userId: string; token: string }) {
    return this.authService.logout(body.userId, body.token);
  }
}
