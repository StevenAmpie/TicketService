import { hash } from "bcrypt";

export async function hashPassword(password: string) {
  const saltOrRounds = 10;

  return await hash(password, saltOrRounds);
}
