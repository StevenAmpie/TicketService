import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { AgentsModule } from "./agents/agents.module";
import { ClientsModule } from "./clients/clients.module";
import { TicketsModule } from "./tickets/tickets.module";
import { CommentsModule } from "./comments/comments.module";
import { TicketsCasesModule } from "./tickets-cases/tickets-cases.module";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "db",
      port: 5433,
      username: "megatech",
      password: "randomPassword",
      database: "megatech",
      autoLoadEntities: true,
      synchronize: false,
    }),
    AuthModule,
    AgentsModule,
    ClientsModule,
    TicketsModule,
    CommentsModule,
    TicketsCasesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
