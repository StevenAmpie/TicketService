import { Column, Entity, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Client } from "../../clients/entities/client.entity";

@Entity("RefreshTokens")
export class RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column({
    name: "clientId",
    type: "uuid",
    nullable: false,
  })
  clientId: string;

  @Column({
    name: "expiresAt",
    type: "bigint",
    nullable: false,
  })
  expiresAt: string;

  @OneToOne(() => Client, client => client.id)
  @JoinColumn()
  client: Client;
}
