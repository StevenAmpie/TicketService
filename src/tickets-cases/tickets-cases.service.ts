import { Injectable } from "@nestjs/common";
import { CreateTicketsCaseDto } from "./dto/create-tickets-case.dto";
import { UpdateTicketsCaseDto } from "./dto/update-tickets-case.dto";

@Injectable()
export class TicketsCasesService {
  create(createTicketsCaseDto: CreateTicketsCaseDto) {
    return "This action adds a new ticketsCase";
  }

  findAll() {
    return `This action returns all ticketsCases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} ticketsCase`;
  }

  update(id: number, updateTicketsCaseDto: UpdateTicketsCaseDto) {
    return `This action updates a #${id} ticketsCase`;
  }

  remove(id: number) {
    return `This action removes a #${id} ticketsCase`;
  }
}
