import {
  Entity,
  Column,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
// import { Comment } from "../../comments/entities/comment.entity";
import { Agent } from "../../agents/entities/agent.entity";

@Entity("Tickets")
export class Ticket {
  @PrimaryGeneratedColumn("uuid")
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

  @CreateDateColumn({
    name: "openedAt",
    type: "timestamptz",
    nullable: false,
  })
  openedAt: Date;

  @Column({
    name: "closedAt",
    type: "timestamp with time zone",
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

  // @OneToMany(() => Comment, comment => comment.ticketId)
  // comments: Comment[];

  @OneToMany(() => Agent, agent => agent.id)
  agents: Agent[];
}
