import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    console.log('Before handling the request...');

    return next
      .handle()
      .pipe(
        tap(() =>
          console.log(
            `After handling the request... Execution time: ${Date.now() - now}ms`,
          ),
        ),
      );
  }
}
