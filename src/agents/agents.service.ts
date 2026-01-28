import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateAgentDto } from "./dto/create-agent.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Agent } from "node:http";
import { DeepPartial, QueryDeepPartialEntity, Repository } from "typeorm";
import { UUID } from "node:crypto";

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private agentsRepository: Repository<Agent>,
  ) {}
  async create(createAgentDto: CreateAgentDto) {
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
    const newAgent = this.agentsRepository.create(
      createAgentDto as DeepPartial<Agent>,
    );
    await this.agentsRepository.save(newAgent);
    return { success: true, message: "Operador creado exitosamente" };
  }

  // async login(email: string, password: string) {
  //   const foundAgent = await this.agentsRepository
  //     .createQueryBuilder("agent")
  //     .where("agent.email = :email", { email })
  //     .getOne();
  //   if (!foundAgent) {
  //     throw new HttpException(
  //       "El correo electrónico o contraseña incorrectos",
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   // compare password hash
  //   if (foundAgent["password"] !== password) {
  //     throw new HttpException(
  //       "El correo electrónico o contraseña incorrectos",
  //       HttpStatus.NOT_FOUND,
  //     );
  //   }
  //   return "JWT Token y creación de refresh token";
  // }

  async findAll() {
    return await this.agentsRepository.find();
  }

  async findOne(id: UUID) {
    const agent = await this.agentsRepository
      .createQueryBuilder("agent")
      .where("agent.id = :id", { id })
      .getOne();
    if (!agent) {
      throw new HttpException("No encontré nada LOL", HttpStatus.NOT_FOUND);
    }
    delete agent["password"];
    return agent;
  }

  async update(id: UUID, updateAgentDto: UpdateAgentDto) {
    const findAgent = await this.findOne(id);
    if (!findAgent) {
      throw new HttpException("No encontré nada LOL", HttpStatus.NOT_FOUND);
    }
    const updateAgent = await this.agentsRepository.update(
      id,
      updateAgentDto as QueryDeepPartialEntity<Agent>,
    );
    if (!updateAgent) {
      return {
        success: false,
        message: "Los datos ingresados no cumplen con el formato correcto",
      };
    }
    return {
      success: true,
      message: "Credenciales actualizadas exitosamente",
    };
  }

}

