import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Patch,
  ParseFilePipeBuilder,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsLegalPipe } from "./pipes/isLegal.pipe";
import type { Express } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { Roles } from "../decorators/roles.decorator";
import { RolesGuard } from "src/guards/roles.guards";
import { CurrentUser } from "src/decorators/getCurrentUser.decorator";
import { JwtDto } from "src/auth/dto/jwt-dto";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("picture"))
  async create(
    @Body(new IsLegalPipe()) createClientDto: CreateClientDto,
    @UploadedFile() picture: Express.Multer.File,
  ) {
    return await this.clientsService.create(createClientDto, picture);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent"])
  @Get()
  async findAll() {
    return await this.clientsService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["client"])
  @Get("/profile")
  async findOne(@CurrentUser() user: JwtDto) {
    return await this.clientsService.findOne(user.sub);
  }

  @Patch("/update")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["client"])
  @UseInterceptors(FileInterceptor("picture"))
  async update(
    @CurrentUser() user: JwtDto,
    @Body(new IsLegalPipe()) updateClientDto: UpdateClientDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpe?g|png|gif|bmp|svg\+xml|webp|ico|tiff|avif)$/,
          errorMessage:
            "Los formatos de imagen permitidos son jpg, jpeg, png, gif, bmp, svg, webp, ico, tiff y avif",
        })
        .build({
          fileIsRequired: false,
        }),
    )
    picture: Express.Multer.File,
  ) {
    return await this.clientsService.update(user.sub, updateClientDto, picture);
  }
}
