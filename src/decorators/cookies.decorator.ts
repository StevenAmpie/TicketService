import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Request } from "express";

export const Cookies = createParamDecorator(
  (cookieName: string, context: ExecutionContext) => {
    const request: Request = context.switchToHttp().getRequest();
    return request.cookies[cookieName] as string;
  },
);
