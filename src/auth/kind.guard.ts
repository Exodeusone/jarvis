import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredKinds = this.reflector.get<string[]>(
      'kind',
      context.getHandler(),
    );
    if (!requiredKinds) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return requiredKinds.some((kind) => user.kind?.includes(kind));
  }
}
