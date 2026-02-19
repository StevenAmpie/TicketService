import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "./dto/login-dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "src/clients/entities/client.entity";
import { Repository } from "typeorm";
import { compare } from "bcrypt";
import { RefreshToken } from "./entities/refresh-token.entity";
import { generateRefreshToken } from "src/helpers/generateRefreshToken";
import { SignOptions } from "jsonwebtoken";
import { Agent } from "../agents/entities/agent.entity";
import { JwtDto } from "./dto/jwt-dto";

type ExpiresIn = SignOptions["expiresIn"];

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(Client)
    private readonly client: Repository<Client>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,
    @InjectRepository(Agent)
    private readonly agentService: Repository<Agent>,
  ) {}

  async login(loginData: LoginDto) {
    const secretkey: string = this.configService.getOrThrow("JWT_SECRET_KEY");
    const expiresTime: ExpiresIn =
      this.configService.getOrThrow("JWT_EXPIRES_IN");

    const payload = {
      sub: loginData.id,
      role: loginData.role,
    };
    const { refreshToken, refreshTokenHashed, refreshExpiresIn } =
      await generateRefreshToken();

    const newRefreshToken = this.refreshTokenRepository.create({
      userId: loginData.id,
      token: refreshTokenHashed,
      expiresAt: refreshExpiresIn.toString(),
    });

    await this.refreshTokenRepository.save(newRefreshToken);

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: secretkey,
        expiresIn: expiresTime,
      }),
      refreshToken: refreshToken,
    };
  }

  async validateUser(email: string, password: string) {
    const regexAgent = /^[A-Za-z][A-Za-z0-9.]*@megatech\.org$/;
    if (regexAgent.test(email)) {
      const agent = await this.agentService.findOneBy({ email: email });
      const isAgentValid = agent && (await compare(password, agent?.password));
      if (isAgentValid) {
        return {
          id: agent.id,
          role: agent.role,
        };
      }
    }
    const client = await this.client.findOneBy({ email: email });
    const isClientValid = client && (await compare(password, client.password));
    if (isClientValid) {
      return {
        id: client.id,
        role: client.role,
      };
    }

    return null;
  }

  async getCurrentToken(userId: string, token: string) {
    let currentToken: RefreshToken | null = null;
    const refreshTokens = await this.refreshTokenRepository.findBy({
      userId: userId,
    });

    for (const refreshToken of refreshTokens) {
      if (await compare(token, refreshToken.token)) {
        currentToken = refreshToken;
        break;
      }
    }

    return currentToken;
  }

  async refreshToken(accessToken: JwtDto, refreshToken: string) {
    const currentToken = await this.getCurrentToken(
      accessToken.sub,
      refreshToken,
    );

    if (!currentToken) {
      throw new UnauthorizedException("Token no encontrado");
    }

    if (Date.now() > Number(currentToken.expiresAt)) {
      throw new UnauthorizedException("Token expirado");
    }
    const payload = {
      sub: accessToken.sub,
      role: accessToken.role,
    };
    const secretkey: string = this.configService.getOrThrow("JWT_SECRET_KEY");
    const expiresTime: ExpiresIn =
      this.configService.getOrThrow("JWT_EXPIRES_IN");

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: secretkey,
        expiresIn: expiresTime,
      }),
    };
  }

  async logout(userId: string, token: string) {
    const currentToken = await this.getCurrentToken(userId, token);

    if (!currentToken) {
      throw new UnauthorizedException("Token no encontrado");
    }

    await this.refreshTokenRepository.delete(currentToken);

    return "Sesión cerrada";
  }
}
