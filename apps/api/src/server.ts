import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';
import { deviceRegistrationSchema, signalEventSchema, type Alert } from '@tradealarm/contracts';
import { createClient } from '@supabase/supabase-js';

const app = Fastify({ logger: true });
const alerts = new Map<string, Alert>();
const devices = new Map<string, { userId:string; token:string; platform:string }>();
const scannerKey = process.env.MEXC_EMA_SCANNER_API_KEY ?? 'dev-scanner-key';
const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth:{ persistSession:false } }) : null;
async function authenticatedUser(authorization: string | undefined): Promise<string | null> {
  const token = authorization?.match(/^Bearer (\S+)$/)?.[1];
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  return error ? null : data.user?.id ?? null;
}

app.get('/health', async () => ({ ok:true, service:'tradealarm-api' }));
app.post('/v1/events', async (request, reply) => {
  if (request.headers['x-scanner-api-key'] !== scannerKey) return reply.code(401).send({ error:'invalid scanner key' });
  const parsed = signalEventSchema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error:'invalid event', issues:parsed.error.issues });
  const key = `${parsed.data.source}:${parsed.data.event_id}`;
  const existing = alerts.get(key);
  if (existing) return reply.code(200).send({ accepted:true, duplicate:true, alert:existing });
  const alert:Alert = { ...parsed.data, id:randomUUID(), received_at:new Date().toISOString(), status:'received' };
  alerts.set(key, alert);
  return reply.code(201).send({ accepted:true, duplicate:false, alert });
});
app.post('/v1/devices', async (request, reply) => {
  const userId = await authenticatedUser(request.headers.authorization);
  if (!userId) return reply.code(401).send({ error:'invalid session' });
  const parsed = deviceRegistrationSchema.safeParse(request.body);
  if (!parsed.success) return reply.code(400).send({ error:'invalid device', issues:parsed.error.issues });
  devices.set(parsed.data.expo_push_token, { userId, token:parsed.data.expo_push_token, platform:parsed.data.platform });
  return reply.code(201).send({ registered:true });
});
app.get('/v1/alerts', async (request, reply) => {
  if (!await authenticatedUser(request.headers.authorization)) return reply.code(401).send({ error:'invalid session' });
  return { alerts:[...alerts.values()].sort((a,b)=>b.received_at.localeCompare(a.received_at)) };
});
app.get('/v1/alerts/:id', async (request, reply) => {
  if (!await authenticatedUser(request.headers.authorization)) return reply.code(401).send({ error:'invalid session' });
  const alert = [...alerts.values()].find(a=>a.id === (request.params as {id:string}).id);
  return alert ? { alert } : reply.code(404).send({ error:'not found' });
});

if (require.main === module) app.listen({ port:Number(process.env.PORT ?? 3000), host:'0.0.0.0' });
export { app, alerts, devices };
