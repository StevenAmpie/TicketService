import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";
import { Not, Repository } from "typeorm";
import { hashPassword } from "../helpers/hashPassword";
import type { Express } from "express";
import { S3Bucket } from "src/s3/s3-bucket";
import { S3Service } from "src/s3/s3.service";
import comparePassword from "src/helpers/comparePassword";

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    private readonly s3Service: S3Service,
    private readonly s3Bucket: S3Bucket,
  ) {}

  async create(createClientDto: CreateClientDto, file: Express.Multer.File) {
    const exceptions: string[] = [];
    const clientUsername = await this.clientsRepository.findOneBy({
      username: createClientDto.username,
    });
    const clientEmail = await this.clientsRepository.findOneBy({
      email: createClientDto.email,
    });

    if (clientUsername) {
      exceptions.push("Ya existe un usuario con este nombre");
    }

    if (clientEmail) {
      exceptions.push("El correo ingresado ya existe en el sistema");
    }

    if (exceptions.length >= 1) {
      throw new HttpException({ detail: exceptions }, HttpStatus.CONFLICT);
    }

    const urlKey = this.s3Bucket.generateUrlKey(file);

    const fileWasUploaded = await this.s3Service.upload({
      key: urlKey,
      buffer: this.s3Bucket.readFileBuffer(file),
      contentType: this.s3Bucket.fileMimeType(file),
    });

    if (!fileWasUploaded) {
      throw new HttpException("Ocurrió un error", HttpStatus.CONFLICT);
    }

    createClientDto["password"] = await hashPassword(createClientDto.password);
    createClientDto["picture"] = urlKey;
    const newClient = this.clientsRepository.create(createClientDto);
    const createdClient = await this.clientsRepository.save(newClient);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...clientResponse } = createdClient;
    return await this.clientsRepository.save(clientResponse);
  }

  async findAll() {
    const clients = await this.clientsRepository.find();

    if (!clients) {
      throw new HttpException("No se ha encontrado", HttpStatus.NOT_FOUND);
    }

    return clients;
  }

  async findOne(id: string) {
    const client = await this.clientsRepository.findOneBy({ id });

    if (!client) {
      throw new HttpException("No se ha encontrado", HttpStatus.NOT_FOUND);
    }

    const url = await this.s3Service.getOneSignedUrl(client.picture);

    return { ...client, urlPicture: url };
  }

  async update(
    id: string,
    updateClientDto: UpdateClientDto,
    picture: Express.Multer.File,
  ) {
    if (!Object.keys(updateClientDto).length && !picture) {
      throw new UnprocessableEntityException(
        "Necesitar actualizar algún campo",
      );
    }

    const client = await this.clientsRepository.findOne({ where: { id } });

    if (!client) {
      throw new NotFoundException("Ocurrio un error, intente nuevamente");
    }

    const userName = await this.clientsRepository
      .createQueryBuilder("Clients")
      .select("Clients.username")
      .where({ username: updateClientDto.username })
      .andWhere({ id: Not(id) })
      .getOne();

    if (userName) {
      throw new HttpException(
        "Ya existe un usuario con este nombre",
        HttpStatus.CONFLICT,
      );
    }

    const clientPassword: string = client.password;
    if (updateClientDto.password) {
      if (
        await comparePassword({
          dtoPassword: updateClientDto.password,
          dbPassword: clientPassword,
        })
      ) {
        throw new HttpException(
          "Su contraseña no puede ser igual a la anterior",
          HttpStatus.BAD_REQUEST,
        );
      }
      updateClientDto.password = await hashPassword(updateClientDto.password);
    }

    if (picture) {
      const newUrlKey = await this.s3Service.updateFile({
        newFile: picture,
        oldKey: client.picture,
      });
      if (!newUrlKey) {
        throw new ConflictException(
          "Ocurrió un error al momento de actualizar su imagen, intente nuevamente",
        );
      }
      updateClientDto["picture"] = newUrlKey;
    }

    const updateClient = this.clientsRepository.merge(client, updateClientDto);
    const updatedClient = await this.clientsRepository.save(updateClient);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...filteredClient } = updatedClient;
    return filteredClient;
  }
}
