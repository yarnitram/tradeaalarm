# TradeAlarm

Private trading-signal notification app. See [PRD.md](PRD.md) and [ARCHITECTURE.md](ARCHITECTURE.md).

## Start
1. Copy `apps/api/.env.example` to `apps/api/.env`.
2. Run `npm install`.
3. Run `npm run dev:api`.
4. Create the Expo app credentials and set `EXPO_PUBLIC_API_URL` in `apps/mobile/.env`.

The API currently uses an in-memory repository for local development; replace it with Supabase adapters before production.
