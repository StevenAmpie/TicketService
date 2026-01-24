/*import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { TicketsCasesService } from "./tickets-cases.service";
import { CreateTicketsCaseDto } from "./dto/create-tickets-case.dto";
import { UpdateTicketsCaseDto } from "./dto/update-tickets-case.dto";

@Controller("tickets-cases")
export class TicketsCasesController {
  constructor(private readonly ticketsCasesService: TicketsCasesService) {}

  @Post()
  create(@Body() createTicketsCaseDto: CreateTicketsCaseDto) {
    return this.ticketsCasesService.create(createTicketsCaseDto);
  }

  @Get()
  findAll() {
    return this.ticketsCasesService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.ticketsCasesService.findOne(+id);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateTicketsCaseDto: UpdateTicketsCaseDto,
  ) {
    return this.ticketsCasesService.update(+id, updateTicketsCaseDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.ticketsCasesService.remove(+id);
  }
}*/
