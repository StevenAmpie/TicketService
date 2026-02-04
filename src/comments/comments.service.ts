import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { JwtDto } from "src/auth/dto/jwt-dto";
import { Ticket } from "src/tickets/entities/ticket.entity";
import { TicketCase } from "src/tickets-cases/entities/ticket-case.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,

    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,

    @InjectRepository(TicketCase)
    private readonly ticketCaseRepository: Repository<TicketCase>,
  ) {}

  async findAllByTicketId(ticketId: string, user: JwtDto) {
    if (user.role !== "client" && user.role !== "agent") {
      throw new UnauthorizedException(
        "No tienes permiso para ver este recurso",
      );
    }

    if (user.role === "client") {
      const verifiedClient = await this.ticketRepository.findOne({
        where: { id: ticketId, clientId: user.sub },
      });

      if (!verifiedClient) {
        throw new UnauthorizedException(
          "No tienes permiso para ver este recurso",
        );
      }
    }

    if (user.role === "agent") {
      const verifiedAgent = await this.ticketCaseRepository.findOne({
        where: { ticketId: ticketId, agentId: user.sub },
      });

      if (!verifiedAgent) {
        throw new UnauthorizedException(
          "No tienes permiso para ver este recurso",
        );
      }
    }

    const comments = await this.commentRepository
      .createQueryBuilder("comments")
      .select(["comments.content", "comments.role", "comments.publishedAt"])
      .where({ ticketId: ticketId })
      .orderBy("comments.publishedAt", "ASC")
      .getMany();

    if (comments.length === 0) {
      throw new NotFoundException("Sin comentarios");
    }

    return comments;
  }

  async create(comment: CreateCommentDto) {
    if (!comment.agentId && !comment.clientId) {
      throw new BadRequestException(
        "El comentario debe estar asignado al menos a 1 usuario",
      );
    }
    const newComment = this.commentRepository.create({
      ...comment,
      publishedAt: new Date(),
    });
    return await this.commentRepository.save(newComment);
  }
}
