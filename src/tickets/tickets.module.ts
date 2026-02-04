import { Module } from "@nestjs/common";
import { TicketsService } from "./tickets.service";
import { TicketsController } from "./tickets.controller";
import { Ticket } from "./entities/ticket.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketsCasesModule } from "../tickets-cases/tickets-cases.module";
import { ClientsModule } from "../clients/clients.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    ClientsModule,
    TicketsCasesModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
