import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from "@nestjs/common";
import { isLegalAge } from "../../helpers/isLegalAge";
import { CreateClientDto } from "../dto/create-client.dto";

@Injectable()
export class IsLegalPipe implements PipeTransform {
  transform(value: CreateClientDto, _metadata: ArgumentMetadata) {
    const isLegal = isLegalAge(value.dateOfBirth);

    if (isLegal === false) {
      throw new BadRequestException(
        "Debes ser mayor de edad para tener una cuenta",
      );
    }
    return value;
  }
}
