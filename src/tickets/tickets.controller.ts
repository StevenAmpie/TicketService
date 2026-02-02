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
} from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Express } from "express";
import type { UUID } from "node:crypto";

@Controller("tickets")
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("picture"))
  create(
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
    return this.ticketsService.create(createTicketDto, file);
  }

  @Post("/assign/:id")
  assignTicket(@Param("id") id: UUID) {
    return this.ticketsService.assignTicket(id);
  }

  @Get()
  findAll() {
    return this.ticketsService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: UUID) {
    return this.ticketsService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("picture"))
  modify(
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
    return this.ticketsService.modify(id, updateTicketDto, file);
  }

  @Patch("/process/:id")
  process(@Param("id") id: UUID) {
    return this.ticketsService.process(id);
  }

  @Delete(":id")
  eliminate(@Param("id") id: UUID) {
    return this.ticketsService.eliminate(id);
  }
}
