import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles } from "../decorators/roles.decorator";
import matchRoles from "../helpers/matchRoles";
import { Client } from "../clients/entities/client.entity";
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }
    const request: Request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const user: Client = request["user"];
    const match = matchRoles(roles, user.role);
    if (!match) {
      throw new UnauthorizedException("No puede acceder a este recurso");
    }
    return match;
  }
}
