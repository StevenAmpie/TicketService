import { Entity, PrimaryColumn } from "typeorm";

@Entity("TicketsCase")
export class TicketCase {
  @PrimaryColumn("uuid")
  ticketId: string;

  @PrimaryColumn("uuid")
  agentId: string;
}
