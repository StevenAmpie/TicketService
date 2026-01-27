import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Comment } from "../../comments/entities/comment.entity";
import { Ticket } from "../../tickets/entities/ticket.entity";

@Entity("Clients")
export class Client {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    type: "varchar",
    length: 15,
    unique: true,
    nullable: false,
  })
  username: string;

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
    length: 6,
    nullable: false,
    default: "agent",
  })
  role: string;

  @OneToMany(() => Comment, comment => comment.clientId)
  comment: Comment[];
  @OneToMany(() => Ticket, ticket => ticket.clientId)
  tickets: Ticket[];
}
