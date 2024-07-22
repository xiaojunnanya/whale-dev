import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, tap } from "rxjs";

@Injectable()
export class LogInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    console.log(`[${method}] ${url} - Request received - params: ${JSON.stringify(request.body)}`);
    return next.handle().pipe(
      tap(() => {
          console.log(`[${method}] ${url} - Response send`);
      }),
    );
  }
}