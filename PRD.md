# TradeAlarm PRD

## Goal
Private iOS/Android trading-signal notifications for personal scanner projects.

## Milestone 1
- Supabase email authentication and secure session persistence.
- Authenticated Expo device registration.
- MEXC EMA Scanner webhook ingestion with per-source API keys.
- Idempotent alert storage and an alert inbox/detail view.
- Expo push proof of concept with delivery status separated from user acknowledgement.

## Later phases
Sources and rules, filters, quiet hours, history, settings, receipt retries, and additional scanners.

## Non-goals
Trading execution, guaranteed alarm override, charts, subscriptions, and public multi-tenant onboarding.

## Acceptance criteria
An authenticated device can register its Expo token; a valid scanner webhook creates one alert for a unique event id; a duplicate is harmless; the alert is visible in the inbox; and the API can enqueue a push notification without exposing scanner secrets to the mobile app.
