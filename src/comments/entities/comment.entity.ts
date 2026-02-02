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
    type: "uuid",
    nullable: true,
  })
  clientId: string;

  @Column({
    type: "uuid",
    nullable: true,
  })
  agentId: string;

  @Column({
    type: "uuid",
    nullable: false,
  })
  ticketId: string;

  @Column({
    type: "boolean",
    nullable: false,
    default: false,
  })
  isRead: boolean;
}
