import {
  IsDateString,
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateClientDto {
  @IsString({ message: "Debe ser string" })
  @MaxLength(15, {
    message: "El username no puede ser mayor de 15 letras",
  })
  username: string;

  @IsDateString(
    {},
    {
      message: "La fecha no está en el formato adecuado YYYY-MM-DD ISO 8601",
    },
  )
  dateOfBirth: string;

  @IsString({ message: "Debe ser string" })
  @IsEmail({}, { message: "Debe ser un email" })
  email: string;

  @IsString({ message: "La contraseña debe contener letras" })
  @MinLength(8, { message: "La contraseña debe ser mayor a 8 letras" })
  password: string;
}
