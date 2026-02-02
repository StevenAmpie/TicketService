import { Entity, PrimaryColumn } from "typeorm";

@Entity("TicketsCase")
export class TicketCase {
  @PrimaryColumn({
    name: "ticketId",
    type: "uuid",
  })
  ticketId: string;

  @PrimaryColumn({
    name: "agentId",
    type: "uuid",
  })
  agentId: string;
}
