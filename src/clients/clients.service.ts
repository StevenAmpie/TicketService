import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateClientDto } from "./dto/create-client.dto";
import { UpdateClientDto } from "./dto/update-client.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Client } from "./entities/client.entity";
import { Not, Repository } from "typeorm";
import { hashPassword } from "../helpers/hashPassword";
import type { Express } from "express";
import { ConfigService } from "@nestjs/config";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { extname } from "path";
import { randomUUID } from "crypto";

@Injectable()
export class ClientsService {
  private clientS3: S3Client;
  private bucket: string;

  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    private readonly configService: ConfigService,
  ) {
    this.clientS3 = new S3Client({
      region: configService.getOrThrow("AWS_REGION"),
      credentials: {
        accessKeyId: configService.getOrThrow("AWS_ACCESS_KEY_ID"),
        secretAccessKey: configService.getOrThrow("AWS_SECRET_ACCESS_KEY"),
      },
    });
    this.bucket = this.configService.getOrThrow<string>("AWS_S3_BUCKET_NAME");
  }

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

    // toDo: create and added sign url.

    const urlKey = `${randomUUID()}${extname(file.originalname)}`;

    const newImage = new PutObjectCommand({
      Bucket: this.bucket,
      Key: urlKey,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this.clientS3.send(newImage);

    createClientDto["password"] = await hashPassword(createClientDto.password);
    createClientDto["picture"] = urlKey;
    const newClient = this.clientsRepository.create(createClientDto);
    return await this.clientsRepository.save(newClient);
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
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    const client = await this.clientsRepository.findOne({ where: { id } });

    if (!client) {
      throw new HttpException("No se ha encontrado", HttpStatus.NOT_FOUND);
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

    // toDO = Delete last picture with input key from the user, and give him a new key.
    updateClientDto["picture"] = "ruta";

    this.clientsRepository.merge(client, updateClientDto);

    return await this.clientsRepository.save(client);
  }
}
