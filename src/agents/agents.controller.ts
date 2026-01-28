import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
import type { UUID } from "node:crypto";

@Controller("agents")
@UsePipes(new ValidationPipe({ transform: true }))
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
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

  @Put(":id")
  update(
    @Param("id", new ParseUUIDPipe()) id: UUID,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    return this.agentsService.update(id, updateAgentDto);
  }
}
