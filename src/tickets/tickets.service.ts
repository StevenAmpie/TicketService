import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Ticket } from "./entities/ticket.entity";
import { UUID } from "node:crypto";
import type { Express } from "express";
import { Repository } from "typeorm";

type role = "agent" | "client";
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto, file: Express.Multer.File) {
    const mockedClientId: UUID = "26f559a6-7ad2-4127-a825-813e75cbd39f";
    // inject s3 Bucket and Service
    // get clientId
    // upload image to s3
    // attach clientId and s3 key to ticket instance
    // create -> check
    // save -> check
    const urlKey = "url generated for s3";

    const newTicket = this.ticketsRepository.create({
      title: createTicketDto.title,
      detail: createTicketDto.detail,
      picture: urlKey,
      clientId: mockedClientId,
    });
    return await this.ticketsRepository.save(newTicket);
  }

  async findAll() {
    const mockRoles: role = "agent";
    const allTickets = await this.ticketsRepository.find();
    if (!allTickets.length) {
      throw new NotFoundException("No hay tickets por el momento");
    }
    //hacer validación con el rol del payload JWT
    // Id, title, detail, status, date -> no picture, closedAt, clientId
    if (mockRoles === "agent") {
      const filteredClientTickets = allTickets.filter(ticket => {
        return ticket.status === "opened" || ticket.status === "processing";
      });
      return filteredClientTickets.map(
        ({ picture, closedAt, clientId, ...frontendData }) => {
          return frontendData;
        },
      );
    }
    const filteredAgentTickets = allTickets.filter(ticket => {
      return ticket.status === "opened";
    });
    return filteredAgentTickets.map(
      ({ picture, closedAt, clientId, ...frontendData }) => {
        return frontendData;
      },
    );
  }

  async findOne(id: UUID) {
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id: id,
        status: "processing",
      },
    });
    if (!ticket) {
      throw new HttpException(
        "No hay tickets por el momento",
        HttpStatus.CONFLICT,
      ); // ask Steven about this, it is limited to processing status no?
    }
    return ticket;
  }

  async update(id: UUID, updateTicketDto: UpdateTicketDto) {
    // role base behavior. Clients can only update a ticket when it's in 'opened' status
    // Agents can change the status of the ticket 'processed'
    // For Agents: their interaction with the endpoint is only to change the status
    const ticket = await this.findOne(id);
    const mockRole: role = "agent";
    if (mockRole === "agent") {
      updateTicketDto["status"] = "processed";
    } else {
      // For Clients: only title, detail and picture can be updated
      // s3 update logic
    }
    const updatedTicket = this.ticketsRepository.merge(ticket, updateTicketDto);
    await this.ticketsRepository.save(updatedTicket);
    return { success: true, message: "El ticket fue actualizado exitosamente" };
  }

  async remove(id: UUID) {
    // use this endpoint for soft delete
    // only accessible for clients?
    const ticket = await this.findOne(id);
    if (ticket.status !== "opened") {
      throw new ConflictException(
        "No puede eliminar un ticket que no está en el estado de abierto",
      );
    }
    const removedTicket = await this.ticketsRepository.update(id, {
      status: "eliminated",
    });
    if (!removedTicket.affected) {
      return {
        success: false,
        message: "Ocurrió algo inesperado, intente nuevamente",
      };
    }
    return { success: true, message: "El ticket fue eliminado exitosamente" };
  }
}
