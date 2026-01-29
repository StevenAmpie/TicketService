import { compare } from "bcrypt";
export default async function comparePassword({
  dtoPassword,
  dbPassword,
}: {
  dtoPassword: string;
  dbPassword: string;
}) {
  return await compare(dtoPassword, dbPassword);
}
