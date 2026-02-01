import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Ticket } from "./entities/ticket.entity";
import { UUID } from "node:crypto";
import type { Express } from "express";
import { Repository } from "typeorm";
import { S3Bucket } from "../s3/s3-bucket";
import { S3Service } from "../s3/s3.service";
import { TicketCase } from "../tickets-cases/dto/create-ticket-case-dto";

type role = "agent" | "client";
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(TicketCase)
    private ticketCaseRepository: Repository<TicketCase>,
    private s3Service: S3Service,
    private s3Bucket: S3Bucket,
  ) {}

  async create(createTicketDto: CreateTicketDto, file: Express.Multer.File) {
    // get clientId -> mock value for now
    const mockedClientId: UUID = "69b39bd1-09ec-4609-88c6-63ec966c7ffb"; // use custom client id for testing
    if (!file) {
      throw new BadRequestException(
        "Para crear un ticket necesita suministrar una foto",
      );
    }
    const urlKey = this.s3Bucket.generateUrlKey(file);
    await this.s3Service.upload({
      key: urlKey,
      buffer: this.s3Bucket.readFileBuffer(file),
      contentType: this.s3Bucket.fileMimeType(file),
    });
    const newTicket = this.ticketsRepository.create({
      title: createTicketDto.title,
      detail: createTicketDto.detail,
      picture: urlKey,
      clientId: mockedClientId,
    });
    return await this.ticketsRepository.save(newTicket);
  }

  async assignTicket(ticketId: UUID) {
    const mockAgentId = "b42c5130-e645-4e23-aca7-81be88f79c73";
    const hasBeenAssigned = await this.findOpenTicket(ticketId);
    if (!hasBeenAssigned) {
      throw new ConflictException(
        "El ticket seleccionado ya le fue asignado a otro operador",
      );
    }
    const assignedTicket = this.ticketCaseRepository.create({
      agentId: mockAgentId,
      ticketId,
    });
    const wasTicketAssigned =
      await this.ticketCaseRepository.save(assignedTicket);
    if (!wasTicketAssigned) {
      throw new ConflictException(
        "El ticket seleccionado ya le fue asignado a otro operador",
      );
    }
    return { success: true, message: "Ticket asignado exitosamente" };
  }

  async findAll() {
    const mockRoles: role = "agent";
    const allTickets = await this.ticketsRepository.find();
    if (!allTickets.length) {
      throw new NotFoundException("No hay tickets por el momento");
    }
    //add validation with JWT payload role
    // Id, title, detail, status, date -> no picture, closedAt, clientId
    if (mockRoles !== "agent") {
      const filteredClientTickets = allTickets.filter(ticket => {
        return ticket.status === "opened" || ticket.status === "processing";
      });
      return filteredClientTickets.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ picture, closedAt, clientId, ...frontendData }) => {
          return frontendData;
        },
      );
    }
    const filteredAgentTickets = allTickets.filter(ticket => {
      return ticket.status === "opened";
    });
    return filteredAgentTickets.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ picture, closedAt, clientId, ...frontendData }) => {
        return frontendData;
      },
    );
  }

  async findOpenTicket(id: UUID) {
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id: id,
        status: "opened",
      },
    });
    if (!ticket) {
      return null;
    }
    return ticket;
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
        "El ticket solicitado no está disponible",
        HttpStatus.CONFLICT,
      );
    }
    return ticket;
  }

  async modify(
    id: UUID,
    updateTicketDto: UpdateTicketDto,
    file: Express.Multer.File,
  ) {
    // A Client only endpoint
    if (!Object.keys(updateTicketDto).length && !file) {
      throw new UnprocessableEntityException(
        "Necesitar actualizar algún campo",
      );
    }
    const ticket = await this.findOne(id);
    if (file) {
      const newPictureKey = await this.s3Service.updateFile({
        newFile: file,
        oldKey: ticket.picture,
      });
      if (!newPictureKey) {
        throw new ConflictException(
          "Ocurrió un error al momento de actualizar su imagen, intente nuevamente",
        );
      }
      updateTicketDto["picture"] = newPictureKey;
    }
    const updatedTicket = this.ticketsRepository.merge(ticket, updateTicketDto);
    await this.ticketsRepository.save(updatedTicket);
    return { success: true, message: "El ticket fue actualizado exitosamente" };
  }

  async process(id: UUID) {
    // An Agent only endpoint
    const ticket = await this.findOne(id);
    if (ticket.status !== "processing") {
      throw new ConflictException(
        "No puede finalizar un ticket que no se está procesando",
      );
    }
    const updateTicket = await this.ticketsRepository.update(id, {
      status: "processed",
    });
    if (!updateTicket.affected) {
      throw new ConflictException("Ocurrió un error inesperado");
    }
    return { success: true, message: "El ticket fue procesado exitosamente" };
  }

  async eliminate(id: UUID) {
    // A Client only endpoint
    const ticket = await this.findOpenTicket(id);
    if (!ticket) {
      throw new ConflictException(
        "No puede eliminar un ticket que no está en el estado de abierto",
      );
    }
    const removedTicket = await this.ticketsRepository.update(id, {
      status: "eliminated",
    });
    if (!removedTicket.affected) {
      throw new ConflictException("Ocurrió un error inesperado");
    }
    return { success: true, message: "El ticket fue eliminado exitosamente" };
  }
}
