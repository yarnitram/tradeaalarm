# TradeAlarm setup

## Local API

```powershell
npm install
npm run dev:api
```

Health check: `GET http://localhost:3000/health`.

Example webhook:

```powershell
$body = @{ event_id='ema-1'; source='mexc-ema-scanner'; event_type='EMA_TOUCH'; symbol='SOLUSDT'; timeframe='1h'; timestamp='2026-11-13T00:00:00.000Z'; priority='high'; metadata=@{ ema_period=200 } } | ConvertTo-Json
Invoke-RestMethod http://localhost:3000/v1/events -Method Post -Headers @{'x-scanner-api-key'='dev-scanner-key'} -ContentType 'application/json' -Body $body
```

## Supabase

Create a Supabase project, apply `supabase/migrations/0001_tradealarm.sql`, and configure email auth. The API adapter is intentionally still in-memory for the first vertical slice; the next implementation step is wiring the repository to Supabase using the service role only on the server.

## Physical push proof

Set the mobile API URL, create an Expo development build, configure APNs/FCM credentials, sign in, grant notifications, and register the device. Standard push delivery remains subject to iOS Focus/silent mode, Android channel settings, connectivity, and OS permissions.

## Checks

```powershell
npm run test --workspace apps/api
npm run typecheck --workspace apps/api
```
