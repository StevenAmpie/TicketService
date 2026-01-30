import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateTicketDto {
  @IsNotEmpty({
    message: "El título del ticket no puede quedar vacío",
  })
  @IsString({
    message: "El título del ticket tiene que ser un string",
  })
  @MaxLength(100, {
    message: "El título no puede exceder los 100 caracteres",
  })
  title: string;

  @IsNotEmpty({
    message: "La descripción del ticket no puede quedar vacía",
  })
  @IsString({
    message: "La descripción del ticket tiene que ser un string",
  })
  detail: string;
}
