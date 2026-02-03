import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import matchRoles from "../helpers/matchRoles";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
  private match: boolean = false;
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride(Roles, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    const user = request.user;
    if (user) {
      this.match = matchRoles(roles, user["role"] as string);
    }
    if (!this.match) {
      throw new ForbiddenException("No puede acceder a este recurso");
    }
    return this.match;
  }
}
