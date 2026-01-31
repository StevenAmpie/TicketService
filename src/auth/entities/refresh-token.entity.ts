import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity("RefreshTokens")
export class RefreshToken {
  @PrimaryColumn()
  id: string;

  @Column({
    name: "userId",
    type: "uuid",
    nullable: false,
  })
  userId: string;

  @Column({
    name: "token",
    type: "text",
    nullable: false,
  })
  token: string;

  @Column({
    name: "expiresAt",
    type: "bigint",
    nullable: false,
  })
  expiresAt: string;
}
