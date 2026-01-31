import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString({ message: "La contraseña debe contener letras" })
  @MinLength(8, { message: "La contraseña debe ser mayor a 8 letras" })
  password: string;
}
