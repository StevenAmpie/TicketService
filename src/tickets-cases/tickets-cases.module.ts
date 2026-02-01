import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TicketCase } from "./entities/ticket-case.entity";

@Module({
  imports: [TypeOrmModule.forFeature([TicketCase])],
  exports: [TypeOrmModule],
})
export class TicketsCasesModule {}
