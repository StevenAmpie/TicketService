import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateAgentDto } from "./create-agent.dto";

export class UpdateAgentDto extends PartialType(
  OmitType(CreateAgentDto, ["email"]),
) {}
