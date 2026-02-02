import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  ticketId: string;

  @IsOptional()
  @IsString()
  clientId: string;

  @IsOptional()
  @IsString()
  agentId: string;
}
