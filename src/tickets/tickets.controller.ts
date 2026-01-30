import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
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
  @UseInterceptors(FileInterceptor("file"))
  create(@Body() createTicketDto: CreateTicketDto, file: Express.Multer.File) {
    return this.ticketsService.create(createTicketDto, file);
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
  update(@Param("id") id: UUID, @Body() updateTicketDto: UpdateTicketDto) {
    return this.ticketsService.update(id, updateTicketDto);
  }

  @Delete(":id")
  remove(@Param("id") id: UUID) {
    return this.ticketsService.remove(id);
  }
}
