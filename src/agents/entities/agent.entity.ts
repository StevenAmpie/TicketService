import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Ticket } from "../../tickets/entities/ticket.entity";
import { Comment } from "../../comments/entities/comment.entity";

@Entity("Agents")
export class Agent {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    name: "fullName",
    type: "varchar",
    length: 15,
    unique: true,
    nullable: false,
  })
  fullName: string;

  @Column({
    name: "dateOfBirth",
    type: "date",
    nullable: false,
  })
  dateOfBirth: Date;

  @Column({
    type: "varchar",
    length: 50,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: "text",
    nullable: false,
  })
  password: string;

  @Column({
    type: "text",
    nullable: false,
  })
  picture: string;

  @Column({
    type: "char",
    length: 5,
    default: "agent",
  })
  role: string;

  @OneToMany(() => Comment, comment => comment.agentId)
  comment: Comment[];
  @OneToMany(() => Ticket, ticket => ticket.id)
  tickets: Ticket[];
}
