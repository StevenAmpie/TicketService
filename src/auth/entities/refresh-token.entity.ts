import { Column, Entity, OneToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Client } from "../../clients/entities/client.entity";

@Entity("RefreshTokens")
export class RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column({
    type: "uuid",
    nullable: false,
  })
  clientId: string;

  @Column({
    type: "bigint",
    nullable: false,
  })
  expiresAt: string;

  @OneToOne(() => Client, client => client.id)
  @JoinColumn()
  client: Client;
}
