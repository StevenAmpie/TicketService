import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { JwtDto } from "../auth/dto/jwt-dto";

export const getAccessToken = createParamDecorator(
  (data: undefined, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];

    if (!token) {
      return null;
    }

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY!, {
        ignoreExpiration: true,
      });

      return payload as JwtDto;
    } catch {
      return null;
    }
  },
);
