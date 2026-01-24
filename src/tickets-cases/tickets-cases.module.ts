import { Module } from "@nestjs/common";
import { TicketsCasesService } from "./tickets-cases.service";
import { TicketsCasesController } from "./tickets-cases.controller";
import { TicketCase } from "./entities/tickets-case.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [TypeOrmModule.forFeature([TicketCase])],
  controllers: [TicketsCasesController],
  providers: [TicketsCasesService],
})
export class TicketsCasesModule {}
