import {
  IsDateString,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from "class-validator";

export class CreateClientDto {
  @IsString({ message: "Debe ser string" })
  @MaxLength(15, {
    message: "El username no puede ser mayor de 15 letras",
  })
  username: string;

  @IsDateString(
    { strict: true },
    { message: "La fecha ingresada no es válida" },
  )
  dateOfBirth: string;

  @Matches(
    /^[A-Za-z][A-Za-z0-9.]*@(?!megatech\.org$)[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    {
      message:
        "El correo electrónico no puede pertenecer al dominio de Megatech",
    },
  )
  @MaxLength(50, {
    message: "El correo electrónico no puede exceder los 50 caracteres",
  })
  email: string;

  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$¡*]).{9,}$/, {
    message:
      "La contraseña debe tener más de 8 caracteres, un caracter especial(@, #, $, ¡ o*), número(s) y letras.",
  })
  @IsNotEmpty({
    message: "La contraseña no puede estar vacía",
  })
  password: string;
}
