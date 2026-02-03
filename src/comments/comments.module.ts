import { Module } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CommentsController } from "./comments.controller";
import { Comment } from "./entities/comment.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Ticket } from "src/tickets/entities/ticket.entity";
import { TicketCase } from "src/tickets-cases/entities/ticket-case.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Ticket, TicketCase])],
  exports: [CommentsService],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
