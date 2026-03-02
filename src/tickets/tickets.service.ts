import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateTicketDto } from "./dto/create-ticket.dto";
import { UpdateTicketDto } from "./dto/update-ticket.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Ticket } from "./entities/ticket.entity";
import { UUID } from "node:crypto";
import type { Express } from "express";
import { Not, Repository } from "typeorm";
import { S3Bucket } from "../s3/s3-bucket";
import { S3Service } from "../s3/s3.service";
import { TicketCase } from "../tickets-cases/dto/create-ticket-case-dto";
import { Client } from "../clients/entities/client.entity";
import { Agent } from "../agents/entities/agent.entity";

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
    @InjectRepository(TicketCase)
    private ticketCaseRepository: Repository<TicketCase>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    private s3Service: S3Service,
    private s3Bucket: S3Bucket,
  ) {}

  async create(
    clientId: string,
    createTicketDto: CreateTicketDto,
    file: Express.Multer.File,
  ) {
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
      clientId,
    });
    await this.ticketsRepository.save(newTicket);
    return { success: true, message: "Ticket creado exitosamente" };
  }

  async assignTicket(ticketId: UUID, agentId: string) {
    const hasBeenAssigned = await this.findOpenTicket(ticketId);
    if (!hasBeenAssigned) {
      throw new ConflictException(
        "El ticket seleccionado ya le fue asignado a otro operador",
      );
    }
    const assignedTicket = this.ticketCaseRepository.create({
      agentId,
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

  async findAll(id: string, role: string, status: string = "opened") {
    const allTickets = await this.ticketsRepository
      .createQueryBuilder("ticket")
      .orderBy("ticket.openedAt", "DESC")
      .getMany();
    if (!allTickets.length) {
      throw new NotFoundException("No hay tickets por el momento");
    }
    if (role !== "agent") {
      const filteredClientTickets = allTickets.filter(ticket => {
        return (
          ticket.clientId === id &&
          (ticket.status === "opened" || ticket.status === "processing")
        );
      });
      if (!filteredClientTickets.length) {
        throw new NotFoundException("No hay tickets por el momento");
      }
      return filteredClientTickets.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ picture, closedAt, clientId, ...frontendData }) => {
          return frontendData;
        },
      );
    }
    const filteredAgentTickets = allTickets.filter(ticket => {
      return ticket.status === status;
    });
    return filteredAgentTickets.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ picture, closedAt, clientId, ...frontendData }) => {
        return frontendData;
      },
    );
  }

  async findHistory(id: string, role: string) {
    if (role !== "agent") {
      const clientHistory = await this.ticketsRepository
        .createQueryBuilder("ticket")
        .where("ticket.clientId = :id", { id })
        .andWhere("ticket.status = :status", { status: "processed" })
        .orderBy("ticket.openedAt", "DESC")
        .getMany();
      if (!clientHistory.length) {
        throw new HttpException("No hay tickets", HttpStatus.NOT_FOUND);
      }
      return clientHistory.map(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ({ picture, closedAt, clientId, ...frontendData }) => {
          return frontendData;
        },
      );
    }
    const agentHistory = await this.ticketsRepository
      .createQueryBuilder("ticket")
      .innerJoin(
        "TicketsCases",
        "ticketCase",
        `"ticketCase"."ticketId" = "ticket"."id"`,
      )
      .innerJoin("Agents", "agent", `"agent"."id" = "ticketCase"."agentId"`)
      .where(`"agent"."id" = :agentId`, { agentId: id })
      .andWhere(`"ticket"."status" = :status`, { status: "processed" })
      .orderBy(`"ticket"."openedAt"`, "DESC")
      .getMany();
    if (!agentHistory.length) {
      throw new HttpException("No hay tickets", HttpStatus.NOT_FOUND);
    }
    return agentHistory.map(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ({ picture, closedAt, clientId, ...frontendData }) => {
        return frontendData;
      },
    );
  }

  async findOpenTicket(id: UUID, status: string = "opened") {
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id,
        status: status,
      },
    });
    if (!ticket) {
      return null;
    }
    return ticket;
  }

  async findOne(id: UUID, userId: string, role: string, statusTicket: string) {
    if (role !== "client") {
      const ticket = await this.findOpenTicket(id, statusTicket);
      if (!ticket) {
        throw new HttpException("No hay tickets", HttpStatus.NOT_FOUND);
      }
      const client = await this.clientsRepository.findOne({
        where: {
          id: ticket.clientId,
        },
      });
      ticket.picture = (await this.s3Service.getOneSignedUrl(
        ticket.picture,
      )) as string;
      const {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        closedAt,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        status,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        clientId,
        ...frontendData
      } = ticket;
      if (client) {
        frontendData["username"] = client.username;
      }
      frontendData["agentId"] = userId;
      frontendData["role"] = role;
      return frontendData;
    }
    //add client username to return
    const clientTicket = await this.ticketsRepository.findOne({
      where: {
        id,
        status: Not("eliminated"),
        clientId: userId,
      },
    });
    if (!clientTicket) {
      throw new UnauthorizedException("Ese ticket no le pertenece");
    }

    clientTicket.picture = (await this.s3Service.getOneSignedUrl(
      clientTicket.picture,
    )) as string;
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      closedAt,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      status,
      ...frontendData
    } = clientTicket;

    const agentName: { fullName: string } | undefined =
      await this.agentRepository
        .createQueryBuilder("agent")
        .select("agent.fullName", "fullName")
        .innerJoin("TicketsCases", "ticket", "ticket.agentId = agent.id")
        .where("ticket.ticketId = :ticketId", {
          ticketId: id,
        })
        .getRawOne();

    frontendData["role"] = role;
    frontendData["username"] = agentName?.fullName ?? "Operador";

    return frontendData;
  }

  async modify(
    clientId: string,
    id: UUID,
    updateTicketDto: UpdateTicketDto,
    file: Express.Multer.File,
  ) {
    if (!Object.keys(updateTicketDto).length && !file) {
      throw new UnprocessableEntityException(
        "Necesitar actualizar algún campo",
      );
    }
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id,
        status: "opened",
        clientId,
      },
    });

    if (!ticket) {
      throw new NotFoundException("No se encontró el ticket deseado");
    }

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
    const ticket = await this.ticketsRepository.findOne({
      where: {
        id,
        status: "processing",
      },
    });
    if (!ticket) {
      throw new NotFoundException(
        "No se encontró un ticket con ese código que se esté procesando",
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

  async eliminate(clientId: string, id: UUID) {
    const ticket = await this.findOpenTicket(id);
    if (!ticket) {
      throw new ConflictException(
        "No puede eliminar un ticket que no está en el estado de abierto",
      );
    }
    if (ticket.clientId !== clientId) {
      throw new UnauthorizedException(
        "No puede eliminar un ticket que no le pertenece",
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
