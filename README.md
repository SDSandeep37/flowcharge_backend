# FlowCharge Backend

Express backend for FlowCharge. It handles authentication, API registration, API key generation, gateway proxying, usage logs, billing, Stripe Checkout, and Stripe webhooks.

## Setup

```bash
npm install
npm run dev
```

The server starts from `index.js` and defaults to port `5000`.

## Environment

Create `flowcharge_backend/.env`:

```env
PORT=5000
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=1
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Scripts

```bash
npm run dev     # start with nodemon
npm start       # start with node
```

## Route Groups

- `/flowcharge/users`: registration, login, session, logout, users, owners.
- `/flowcharge/apis`: API registration and listing.
- `/flowcharge/apikeys`: API key creation.
- `/flowcharge/logs`: usage log lookup.
- `/flowcharge/billing`: billing lookup.
- `/flowcharge/payment`: Stripe Checkout session creation.
- `/flowcharge/webhook`: Stripe webhook endpoint.
- `/`: gateway catch-all route for proxied API calls.

## Gateway Request Example

```text
GET http://localhost:5000/some/resource?flowcharge=SD_xxxxx
```

The gateway validates the API key, resolves the registered API base URL, forwards the request, logs usage, updates billing, and returns upstream data with gateway metadata.

## Database

Database tables are created on startup by `src/configs/db.js`:

- `users`
- `apis`
- `apis_keys`
- `usage_logs`
- `billing`
- `payments`

Billing is tracked per consumer, per API, per month. The current request price is `1` INR per gateway call.
