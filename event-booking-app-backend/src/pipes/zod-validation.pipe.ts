import { PipeTransform, BadRequestException, Injectable } from '@nestjs/common';
import * as zod from 'zod';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: zod.ZodSchema) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Validation failed');
    }
  }
}
