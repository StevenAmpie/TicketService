import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { IsLegalPipe } from "./pipes/isLegal.pipe";
import type { Express } from "express";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("clients")
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async create(
    @Body(new IsLegalPipe()) createClientDto: CreateClientDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.clientsService.create(createClientDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return await this.clientsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async findOne(@Param("id", new ParseUUIDPipe()) id: string) {
    return await this.clientsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  async update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() updateClientDto: UpdateClientDto,
  ) {
    return await this.clientsService.update(id, updateClientDto);
  }
}
