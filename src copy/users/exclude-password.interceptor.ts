import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ExcludePasswordInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => this.excludePassword(data)));
  }

  private excludePassword(data: any): any {
    if (
      data &&
      typeof data === 'object' &&
      data.data &&
      Array.isArray(data.data)
    ) {
      return {
        ...data,
        data: data.data.map((obj) => this.excludeUserPassword(obj)),
      };
    } else if (Array.isArray(data)) {
      return data.map((user) => this.excludeUserPassword(user));
    } else if (data && typeof data === 'object' && data.password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = data;
      return rest;
    }
    return data;
  }

  private excludeUserPassword(user: any): any {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...rest } = user;
    return rest;
  }
}
