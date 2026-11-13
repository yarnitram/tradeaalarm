# TradeAlarm Architecture

```text
MEXC EMA Scanner --API key--> Fastify API --RLS/service role--> Supabase Postgres
                                      |                         |
                                      +--> push worker --> Expo Push --> APNs/FCM
Expo mobile --Supabase session--> Fastify API / Supabase Auth
```

The mobile client never contains scanner keys or the Supabase service-role key. Webhook events are validated with shared Zod contracts and deduplicated by `(source_id, event_id)`. User-facing tables are protected by RLS; the API uses a server-side service role only after authenticating the caller or validating a source key. Push provider acceptance is recorded separately from `opened_at`/acknowledgement.

## Monorepo
- `apps/mobile`: Expo Router app, dark compact trading UI.
- `apps/api`: Fastify HTTP API and worker boundary.
- `packages/contracts`: shared event/device/alert schemas.
- `supabase/migrations`: schema, indexes, and RLS.
