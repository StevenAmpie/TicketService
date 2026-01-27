import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { ClientsService } from "./clients.service";
import { Client } from "./entities/client.entity";

describe("clientsService", () => {
  let clientsService: ClientsService;
  const mockClient = [
    {
      id: "9007b9c8-2e24-490f-afad-993aeea8ece2",
      username: "Steven",
      dateOfBirth: "2004-01-04",
      email: "steven.ampie@gmail.com",
      password: "$2b$10$5sgBwZ5uZ18LXXH1LWLZsunv1CaqIw7mp73J.XgCVG8525zyrcSLW",
      picture: "https://ruta.com",
      role: "client",
    },

    {
      id: "8007b9c8-2e24-490f-afad-993aeea8ece2",
      username: "Steven2",
      dateOfBirth: "2004-01-04",
      email: "steven2.ampie@gmail.com",
      password: "$2b$10$5sgBwZ5uZ18LXXH1LWLZsunv1CaqIw7mp73J.XgCVG8525zyrcSLW",
      picture: "https://ruta.com",
      role: "client",
    },
  ];

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ClientsService,
        {
          provide: getRepositoryToken(Client),
          useValue: {
            find: jest.fn().mockResolvedValue(mockClient),
            findOneBy: jest.fn().mockResolvedValue(mockClient[0]),
          },
        },
      ],
    }).compile();

    clientsService = await moduleRef.get(ClientsService);
  });

  describe("findAll", () => {
    it("should return an array of Clients", async () => {
      expect(await clientsService.findAll()).toEqual(mockClient);
    });
  });

  describe("findOne", () => {
    const id = `9007b9c8-2e24-490f-afad-993aeea8ece2`;

    it("Should return one object client", async () => {
      expect(await clientsService.findOne(id)).toEqual(mockClient[0]);
    });
  });
});
