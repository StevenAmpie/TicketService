import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  UseGuards,
} from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import type { UUID } from "node:crypto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guards";
import { Roles } from "../decorators/roles.decorator";
import { CurrentUser } from "../decorators/getCurrentUser.decorator";
import { JwtDto } from "../auth/dto/jwt-dto";

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["client"])
  @Post()
  @UseInterceptors(FileInterceptor("picture"))
  create(
    @CurrentUser() user: JwtDto,
    @Body() createTicketDto: CreateTicketDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /^image\/(jpe?g|png|gif|bmp|svg\+xml|webp|ico|tiff|avif)$/,
          errorMessage:
            "Los formatos de imagen permitidos son jpg, jpeg, png, gif, bmp, svg, webp, ico, tiff y avif",
        })
        .build({
          fileIsRequired: true,
        }),
    )
    file: Express.Multer.File,
  ) {
    return this.ticketsService.create(user.sub, createTicketDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent"])
  @Post("/assign/:id")
  assignTicket(@Param("id") id: UUID, @CurrentUser() user: JwtDto) {
    return this.ticketsService.assignTicket(id, user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent", "client"])
  @Get("/available")
  findAll(@CurrentUser() user: JwtDto) {
    return this.ticketsService.findAll(user.sub, user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent", "client"])
  @Get(":id")
  findOne(@CurrentUser() user: JwtDto, @Param("id") id: UUID) {
    return this.ticketsService.findOne(id, user.sub, user.role);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["client"])
  @Patch(":id")
  @UseInterceptors(FileInterceptor("picture"))
  modify(
    @CurrentUser() user: JwtDto,
    @Param("id") id: UUID,
    @Body() updateTicketDto: UpdateTicketDto,
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
    file: Express.Multer.File,
  ) {
    return this.ticketsService.modify(user.sub, id, updateTicketDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent"])
  @Patch("/process/:id")
  process(@Param("id") id: UUID) {
    return this.ticketsService.process(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["client"])
  @Delete(":id")
  eliminate(@CurrentUser() user: JwtDto, @Param("id") id: UUID) {
    return this.ticketsService.eliminate(user.sub, id);
  }
}
