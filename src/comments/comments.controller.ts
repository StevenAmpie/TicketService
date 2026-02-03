import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CurrentUser } from "src/decorators/getCurrentUser.decorator";
import { JwtDto } from "src/auth/dto/jwt-dto";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get("tickets/:uuid/comments")
  async findAll(@CurrentUser() user: JwtDto, @Param("uuid") ticketId: string) {
    return await this.commentsService.findAllByTicketId(ticketId, user);
  }

  // ToDo: added authorization in WebSockets
  @Post("comments")
  async create(@Body() comment: CreateCommentDto) {
    return await this.commentsService.create(comment);
  }
}
