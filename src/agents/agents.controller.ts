import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
import type { UUID } from "node:crypto";
import { IsLegalPipe } from "../clients/pipes/isLegal.pipe";
import type { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("agents")
@UsePipes(new ValidationPipe({ transform: true }))
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  create(
    @Body(new IsLegalPipe()) createAgentDto: CreateAgentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.agentsService.create(createAgentDto, file);
  }

  @Get()
  async findAll() {
    const allAgents = await this.agentsService.findAll();
    return { message: allAgents };
  }

  @Get(":id")
  findOne(@Param("id", new ParseUUIDPipe()) id: UUID) {
    return this.agentsService.findOne(id);
  }

  @Patch(":id")
  @UseInterceptors(FileInterceptor("file"))
  update(
    @Param("id", new ParseUUIDPipe()) id: UUID,
    @Body(new IsLegalPipe()) updateAgentDto: UpdateAgentDto,
  ) {
    return this.agentsService.update(id, updateAgentDto);
  }
}
