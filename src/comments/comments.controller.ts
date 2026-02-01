import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get("tickets/:uuid/comments")
  async findAll(@Param("uuid") id: string) {
    return await this.commentsService.findAllByTicketId(id);
  }

  @Post("comments")
  async create(@Body() comment: CreateCommentDto) {
    return await this.commentsService.create(comment);
  }
}
