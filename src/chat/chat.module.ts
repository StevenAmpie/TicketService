import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";
import { CommentsService } from "../comments/comments.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment } from "../comments/entities/comment.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  providers: [ChatGateway, CommentsService],
})
export class ChatModule {}
