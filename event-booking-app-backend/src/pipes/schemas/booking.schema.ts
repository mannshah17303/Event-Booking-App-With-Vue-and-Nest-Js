import { number, z } from 'zod';

export const createBookingSchema = z.object({
  user_id: z.number(),
  event_id: z.number(),
  booking_date: z.date(),
  quantity: z.number(),
  price_per_ticket: z.number(),
  total_price: number(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
