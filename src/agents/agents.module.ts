import { Module } from "@nestjs/common";
import { AgentsService } from "./agents.service";
import { AgentsController } from "./agents.controller";
import { Agent } from "./entities/agent.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Agent])],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
