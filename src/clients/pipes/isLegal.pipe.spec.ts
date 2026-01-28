import { ArgumentMetadata, BadRequestException } from "@nestjs/common";
import { IsLegalPipe } from "./isLegal.pipe";

const clientLegal = {
  id: "64cb4123-a9b1-41a5-9edf-32beabe7b2c1",
  username: "Pablo Balderas3",
  dateOfBirth: "2004-01-04",
  email: "pablo3.cardenas@gmail.com",
  password: "soyunacontrasena",
  picture: "ruta",
  role: "client",
};

const clientIlegal = {
  id: "64cb4123-a9b1-41a5-9edf-32beabe7b2c1",
  username: "Pablo Balderas3",
  dateOfBirth: "2011-01-04",
  email: "pablo3.cardenas@gmail.com",
  password: "soyunacontrasena",
  picture: "ruta",
  role: "client",
};

const metadata: ArgumentMetadata = {
  type: "body",
  metatype: Object,
  data: undefined,
};

const pipe = new IsLegalPipe();

describe("IsLegalPipe when is legal", () => {
  it("should be return the date of birth ", () => {
    expect(pipe.transform(clientLegal, metadata)).toEqual(clientLegal);
  });
});

describe("IsLegalPipe when is not legal", () => {
  const exception = new BadRequestException(
    "Debes ser mayor de edad para tener una cuenta",
  );

  it("should be return 400 exception", () => {
    expect(() => pipe.transform(clientIlegal, metadata)).toThrow(exception);
  });
});
