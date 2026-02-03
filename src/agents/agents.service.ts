import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Agent } from "./entities/agent.entity";
import { Repository } from "typeorm";
import type { Express } from "express";
import { S3Service } from "../s3/s3.service";
import { S3Bucket } from "../s3/s3-bucket";
import { hashPassword } from "../helpers/hashPassword";
import comparePassword from "../helpers/comparePassword";

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentsRepository: Repository<Agent>,
    private s3Service: S3Service,
    private s3Bucket: S3Bucket,
  ) {}
  async create(createAgentDto: CreateAgentDto, file: Express.Multer.File) {
    const agent = await this.agentsRepository
      .createQueryBuilder("agent")
      .where("agent.email = :email", { email: createAgentDto.email })
      .getOne();
    if (agent) {
      throw new HttpException(
        "Un operador ya existe con este correo electrónico",
        HttpStatus.BAD_REQUEST,
      );
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
    createAgentDto["password"] = await hashPassword(createAgentDto["password"]);
    createAgentDto["picture"] = urlKey;
    const newAgent = this.agentsRepository.create(createAgentDto);
    await this.agentsRepository.save(newAgent);
    return { success: true, message: "Operador creado exitosamente" };
  }

  async findAll() {
    const agents = await this.agentsRepository.find();
    if (!agents.length) {
      throw new HttpException(
        "No hay operadores por el momento",
        HttpStatus.NOT_FOUND,
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return agents.map(({ password, ...filteredAgents }) => filteredAgents);
  }

  async findOne(id: string) {
    const agent = await this.agentsRepository
      .createQueryBuilder("agent")
      .where("agent.id = :id", { id })
      .getOne();
    if (!agent) {
      throw new HttpException(
        "No existe operador con ese identificador",
        HttpStatus.NOT_FOUND,
      );
    }
    agent.picture = (await this.s3Service.getOneSignedUrl(
      agent.picture,
    )) as string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...filteredAgent } = agent;
    return filteredAgent;
  }

  async update(
    id: string,
    updateAgentDto: UpdateAgentDto,
    file: Express.Multer.File,
  ) {
    if (!Object.keys(updateAgentDto).length && !file) {
      throw new UnprocessableEntityException("Necesita actualizar algún campo");
    }
    const foundAgent = await this.agentsRepository
      .createQueryBuilder("agent")
      .where("agent.id = :id", { id })
      .getOne();

    if (!foundAgent) {
      throw new HttpException(
        "Ocurrió un error, intente nuevamente",
        HttpStatus.NOT_FOUND,
      );
    }
    const agentPassword: string = foundAgent.password;
    if (updateAgentDto.password) {
      if (
        await comparePassword({
          dtoPassword: updateAgentDto.password,
          dbPassword: agentPassword,
        })
      ) {
        throw new HttpException(
          "Su contraseña no puede ser igual a la anterior",
          HttpStatus.BAD_REQUEST,
        );
      }
      updateAgentDto.password = await hashPassword(updateAgentDto.password);
    }

    const newUrlKey = await this.s3Service.updateFile({
      newFile: file,
      oldKey: foundAgent.picture,
    });
    if (!newUrlKey) {
      throw new ConflictException(
        "Ocurrió un error al momento de actualizar su imagen, intente nuevamente",
      );
    }
    updateAgentDto["picture"] = newUrlKey;

    const updateAgent = this.agentsRepository.merge(foundAgent, updateAgentDto);
    const updatedAgent = await this.agentsRepository.save(updateAgent);
    updatedAgent.picture = (await this.s3Service.getOneSignedUrl(
      updatedAgent.picture,
    )) as string;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...filteredAgent } = updatedAgent;
    return filteredAgent;
  }
}
