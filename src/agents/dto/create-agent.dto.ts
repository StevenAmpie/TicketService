import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";

export class CreateAgentDto {
  @MaxLength(15, {
    message: "El nombre no debe exceder los 15 caracteres",
  })
  @IsString()
  @IsNotEmpty({
    message: "El nombre completo no puede estar vacío",
  })
  fullName: string;

  @IsDateString(
    { strict: true },
    { message: "La fecha ingresada no es válida" },
  )
  dateOfBirth: Date;

  @Matches(/^[A-Za-z][A-Za-z0-9.]*@megatech\.org$/, {
    message: "El correo electrónico debe pertenecer al dominio de Megatech",
  })
  @MaxLength(50, {
    message: "El correo electrónico no puede exceder los 50 caracteres",
  })
  email: string; // 50 max

  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$¡*]).{9,}$/, {
    message:
      "La contraseña debe tener más de 8 caracteres, un caracter especial(@, #, $, ¡ o*), número(s) y letras.",
  })
  @IsNotEmpty({
    message: "La contraseña no puede estar vacía",
  })
  password: string;
}
