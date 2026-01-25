import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { Comment } from "../../comments/entities/comment.entity";
import { Agent } from "../../agents/entities/agent.entity";

@Entity("Tickets")
export class Ticket {
  @PrimaryColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: "text",
    nullable: false,
  })
  detail: string;

  @Column({
    type: "text",
    nullable: false,
  })
  picture: string;

  @Column({
    name: "openedAt",
    type: "timestamp",
    nullable: false,
  })
  openedAt: Date;

  @Column({
    name: "closedAt",
    type: "timestamp",
    nullable: false,
  })
  closedAt: Date;

  @Column({
    type: "varchar",
    length: 10,
    default: "opened",
    nullable: false,
  })
  status: string;

  @Column({
    name: "clientId",
    type: "uuid",
    nullable: false,
  })
  clientId: string;

  @OneToMany(() => Comment, comment => comment.ticketId)
  comments: Comment[];

  @OneToMany(() => Agent, agent => agent.id)
  agents: Agent[];
}
