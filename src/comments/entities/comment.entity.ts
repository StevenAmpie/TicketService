import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("Comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: "text",
    nullable: false,
  })
  content: string;

  @Column({
    name: "publishedAt",
    type: "timestamp",
    nullable: false,
  })
  publishedAt: Date;

  @Column({
    type: "varchar",
    length: 6,
    nullable: false,
  })
  role: string;

  @Column({
    name: "clientId",
    type: "uuid",
    nullable: true,
  })
  clientId: string;

  @Column({
    name: "agentId",
    type: "uuid",
    nullable: true,
  })
  agentId: string;

  @Column({
    name: "ticketId",
    type: "uuid",
    nullable: false,
  })
  ticketId: string;

  @Column({
    name: "isRead",
    type: "boolean",
    nullable: false,
    default: false,
  })
  isRead: boolean;
}
