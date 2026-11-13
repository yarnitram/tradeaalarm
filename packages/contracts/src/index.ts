import { z } from 'zod';
export const prioritySchema = z.enum(['normal','high','urgent']);
export const signalEventSchema = z.object({ event_id:z.string().min(1), source:z.string().min(1), event_type:z.string().min(1), symbol:z.string().min(1), exchange:z.string().optional(), market:z.string().optional(), timeframe:z.string().min(1), side:z.enum(['long','short','neutral']).default('neutral'), price:z.number().optional(), priority:prioritySchema.default('normal'), timestamp:z.string().datetime(), metadata:z.record(z.unknown()).default({}) });
export const deviceRegistrationSchema = z.object({ expo_push_token:z.string().min(1), platform:z.enum(['ios','android']), device_name:z.string().max(100).optional() });
export type SignalEvent = z.infer<typeof signalEventSchema>;
export type DeviceRegistration = z.infer<typeof deviceRegistrationSchema>;
export type Alert = SignalEvent & { id:string; received_at:string; status:'received'|'queued'|'submitted'|'opened'; };
