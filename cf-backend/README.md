# cf-backend

Production-ready Node.js (Express) API using PostgreSQL + Prisma.

## Setup

1. Install dependencies

```bash
npm i
```

2. Create `.env` from `.env.example` and update values

3. Generate Prisma client

```bash
npm run prisma:generate
```

4. Run migrations

```bash
npm run prisma:migrate
```

5. Seed default admin

```bash
npm run seed
```

## PG connection check

```bash
curl -i http://localhost:5000/health/db
```

## Auth Flow

- Access token is returned in JSON and should be stored in memory on the client.
- Refresh token is stored in an HttpOnly cookie.
- Optionally, you can enable the access token cookie in `src/controllers/authController.js`.

## Next.js (client) usage

All auth calls should include credentials so cookies are sent:

```ts
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({ email, password })
});

fetch('http://localhost:5000/api/auth/refresh', {
  method: 'POST',
  credentials: 'include'
});
```

## E-commerce endpoints

### Public

- `GET /api/v1/cart`
- `POST /api/v1/cart/items`
- `PUT /api/v1/cart/items/{itemId}`
- `DELETE /api/v1/cart/items/{itemId}`
- `POST /api/v1/checkout`
- `GET /api/v1/orders`
- `GET /api/v1/orders/{orderId}`

### Admin

- `GET /api/v1/admin/orders`
- `GET /api/v1/admin/orders/{orderId}`
- `PUT /api/v1/admin/orders/{orderId}`
- `POST /api/v1/admin/orders/{orderId}/refund`
- `POST /api/v1/admin/orders/{orderId}/fulfill`
- `POST /api/v1/admin/orders/{orderId}/cancel`

### Blog endpoints

### Public

- `GET /api/v1/posts`
- `GET /api/v1/posts/{slug}`
- `GET /api/v1/tags`
- `GET /api/v1/categories`

### Admin

- `GET /api/v1/admin/posts`
- `POST /api/v1/admin/posts`
- `PUT /api/v1/admin/posts/{postId}`
- `DELETE /api/v1/admin/posts/{postId}`
- `POST /api/v1/admin/posts/{postId}/publish`
- `POST /api/v1/admin/posts/{postId}/unpublish`

### Sample curl

```bash
curl -i -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane","email":"jane@example.com","password":"secret123"}'

curl -i -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@interior.com","password":"Admin@123"}'

curl -i http://localhost:5000/api/v1/categories
curl -i http://localhost:5000/api/v1/products
curl -i -H "Authorization: Bearer <accessToken>" http://localhost:5000/api/v1/invoices
curl -i -H "Authorization: Bearer <accessToken>" http://localhost:5000/api/v1/invoices/<invoiceId>
curl -i -H "Authorization: Bearer <accessToken>" http://localhost:5000/api/v1/cart
curl -i -X POST http://localhost:5000/api/v1/checkout \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json"

curl -i -H "Authorization: Bearer <accessToken>" http://localhost:5000/api/v1/orders

curl -i -X POST http://localhost:5000/api/v1/quotes \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{ "notes":"Kitchen quote", "items":[{"productId":"<productId>","quantity":1}] }'
```

## Scripts

- `npm run dev`
- `npm start`
- `npm run prisma:generate`
- `npm run prisma:migrate`
- `npm run seed`
