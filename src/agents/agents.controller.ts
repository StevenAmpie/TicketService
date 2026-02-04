import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  UsePipes,
  ValidationPipe,
  UploadedFile,
  UseInterceptors,
  ParseFilePipeBuilder,
  UseGuards,
} from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
import { IsLegalPipe } from "../clients/pipes/isLegal.pipe";
import type { Express } from "express";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../guards/roles.guards";
import { Roles } from "../decorators/roles.decorator";
import { CurrentUser } from "../decorators/getCurrentUser.decorator";
import { JwtDto } from "../auth/dto/jwt-dto";

@Controller("agents")
@UsePipes(new ValidationPipe({ transform: true }))
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor("picture"))
  create(
    @Body(new IsLegalPipe()) createAgentDto: CreateAgentDto,
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
    return this.agentsService.create(createAgentDto, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent"])
  @Get()
  async findAll() {
    const allAgents = await this.agentsService.findAll();
    return { message: allAgents };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent"])
  @Get("/profile")
  findOne(@CurrentUser() user: JwtDto) {
    return this.agentsService.findOne(user.sub);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(["agent"])
  @Patch("/update")
  @UseInterceptors(FileInterceptor("picture"))
  update(
    @CurrentUser() user: JwtDto,
    @Body(new IsLegalPipe()) updateAgentDto: UpdateAgentDto,
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
    return this.agentsService.update(user.sub, updateAgentDto, file);
  }
}
