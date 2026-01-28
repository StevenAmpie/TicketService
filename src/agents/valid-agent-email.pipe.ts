import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

@Injectable()
export class ValidateAgentEmail implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    const emailRegex = /^[A-Za-z][A-Za-z0-9._]*@megatech\.org$/;
    if (!emailRegex.test(value) && metadata.metatype === String) {
      throw new HttpException(
        "El correo electrónico debe pertenecer al dominio de Megatech",
        HttpStatus.BAD_REQUEST,
      );
    }
    return value;
  }
}
