# Stone House Event Platform Spec

Working copy for the `event-platform` branch. The source PDF is `Stone House Event Marketing Platform Spec.pdf` (Nov 3, 2026). Use this file with `CURSOR_BUILD_BRIEF.md`.

Build this inside the existing stonehouse.io site on Vercel. Private buyouts stay on `/events`. Public music events use `/calendar`.

## Version 1

One public music event playbook. Staff enter the event once. The app creates the public page, direct Stripe checkout, QR tickets, Mailchimp drafts, WhatsApp drafts, and paused Meta ads. People approve anything public, sent, or paid.

Stonehouse LLC, doing business as Stone House, owns ticket sales and receives Stripe payouts. Ticket prices include Stone House fees. All sales are final unless Stone House cancels or changes the date.

## Routes

| URL | Purpose |
| --- | --- |
| `/calendar` | Upcoming events |
| `/calendar/{event-slug}` | Event page and ticket selector |
| `/calendar/{event-slug}/checkout` | Embedded Stripe Checkout |
| `/tickets/{order-token}` | Buyer order and QR tickets |
| `/calendar/past` | Completed events |

`/calendar` currently redirects to `/events`. Remove that redirect only when the new calendar page is ready to replace it. The homepage says private buyouts only and no shared events. Change that copy before public ticket sales launch.

## Roles

| Action | Owner | Marketing | Event manager | Finance | Door |
| --- | --- | --- | --- | --- | --- |
| Create and edit events | Yes | Yes | Yes | No | No |
| Publish pages | Yes | Yes | Yes | No | No |
| Approve campaigns | Yes | Yes | Yes | No | No |
| Activate paid ads or raise the ad budget | Yes | No | No | No | No |
| Issue refunds | Yes | No | No | Yes | No |
| Check in guests | Yes | Yes | Yes | No | Yes |
| Manage integrations | Yes | No | No | No | No |

## Ticketing rules

- Hold inventory for 30 minutes inside a database transaction.
- Sold tickets plus active holds never exceed capacity.
- Mark an order paid only after a verified `checkout.session.completed` webhook. Process each webhook once.
- `checkout.session.expired` releases the hold.
- One QR token per ticket. One scan admits one ticket.
- Show one fee-inclusive price. Do not add a service fee.
- Food and beverage toggle requires included items plus separate admission and food and beverage amounts that add up to the ticket price. Checkout shows both.
- Includes alcohol keeps Meta ads at 21+.
- A ticket cannot publish until its tax profile is set: `admission`, or `split` when food and beverage is included.
- Cancellation refunds every ticket in full and notifies buyers. A date change keeps tickets valid and gives buyers 10 days from the notice to request a full refund, ending no later than the new start.

## Phase 1 in this repo

Phase 1 is the database, staff roles, event form, ticket setup, public calendar pages, and event structured data. Later phases add checkout, campaigns, WhatsApp, and Meta ads.

The checked-in code so far is the rule layer those screens will use:

- `platform/permissions.mjs`
- `platform/slug.mjs`
- `platform/tickets.mjs`
- `platform/events.mjs`
- `platform/structured-data.mjs`
- `platform/schema.sql`

Postgres is the system of record. `DATABASE_URL` goes in Vercel, not in git. Until that database is connected, local staff entry is saved on this computer only.

Preview the branch without touching the live site:

```bash
npm run dev:platform
```

Open `http://127.0.0.1:8787/admin/events`. Drafts stay off `http://127.0.0.1:8787/calendar`. The hosted admin stays closed until staff login exists.

Staff login with individual accounts and multi-factor authentication is the next setup step. The WhatsApp business number can wait until ticketing works.
