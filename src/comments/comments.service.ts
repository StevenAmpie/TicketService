import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAllByTicketId(id: string) {
    const comments = await this.commentRepository
      .createQueryBuilder("comments")
      .select(["comments.content", "comments.role", "comments.publishedAt"])
      .where({ ticketId: id })
      .orderBy("comments.publishedAt", "ASC")
      .getMany();

    if (comments.length === 0) {
      throw new NotFoundException("Sin comentarios");
    }

    return comments;
  }

  async create(comment: CreateCommentDto) {
    const newComment = this.commentRepository.create({
      ...comment,
      publishedAt: new Date(),
    });
    return await this.commentRepository.save(newComment);
  }
}
