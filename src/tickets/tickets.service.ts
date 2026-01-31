import {
  BadRequestException,
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
import { S3Bucket } from "../s3/s3-bucket";
import { S3Service } from "../s3/s3.service";

type role = "agent" | "client";
@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketsRepository: Repository<Ticket>,
    private s3Service: S3Service,
    private s3Bucket: S3Bucket,
  ) {}

  async create(createTicketDto: CreateTicketDto, file: Express.Multer.File) {
    // inject s3 Bucket and Service -> check
    // get clientId -> mock value for now
    // upload image to s3 -> check
    // attach clientId and s3 key to ticket instance -> mock value for now
    // create -> check
    // save -> check
    const mockedClientId: UUID = "26f559a6-7ad2-4127-a825-813e75cbd39f";
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

  async modify(
    id: UUID,
    updateTicketDto: UpdateTicketDto,
    file: Express.Multer.File,
  ) {
    // A Client only endpoint
    // query the ticket with the param id -> check
    // if the ticket not found throw a Not Found Exception -> check
    // if we have a file, update the picture in S3
    // merge the DTO with the found Ticket -> check
    const ticket = await this.findOne(id);
    if (file) {
      // write S3 update logic
    }
    const updatedTicket = this.ticketsRepository.merge(ticket, updateTicketDto);
    await this.ticketsRepository.save(updatedTicket);
    return { success: true, message: "El ticket fue actualizado exitosamente" };
  }

  async process(id: UUID) {
    // An Agent only endpoint
    // query the ticket with the param id -> check
    // if the ticket not found throw a Not Found Exception -> check
    // check ticket status -> check
    // if ticket status is not 'processing' throw an Exception -> check
    // update ticket status to 'processed' -> check
    // return a success message -> check
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
    // query the ticket with the param id -> check
    // if the ticket not found throw a Not Found Exception -> check
    // check if ticket status is not opened throw an Exception -> check
    // update ticket status to 'eliminated' -> check
    // if update not successful throw an Exception -> check
    // return a success message -> check
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
      throw new ConflictException("Ocurrió un error inesperado");
    }
    return { success: true, message: "El ticket fue eliminado exitosamente" };
  }
}
