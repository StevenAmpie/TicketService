import { Module } from "@nestjs/common";
import { ClientModule } from "./client/client.module";
import { AgentModule } from "./agent/agent.module";
import { TicketModule } from "./ticket/ticket.module";
import { CommentModule } from "./comment/comment.module";

@Module({
  imports: [ClientModule, AgentModule, TicketModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
