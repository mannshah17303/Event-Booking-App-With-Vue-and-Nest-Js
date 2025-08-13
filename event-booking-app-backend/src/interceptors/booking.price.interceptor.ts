import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class BookingPriceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (request.body) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const { quantity, price_per_ticket } = request.body;

      if (quantity && price_per_ticket) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        request.body.total_price = quantity * price_per_ticket;
      }
    }

    return next.handle();
  }
}
