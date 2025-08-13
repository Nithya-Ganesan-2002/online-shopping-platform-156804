This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Overview

Modern, minimalistic ecommerce frontend for browsing products, managing a cart, checkout, and order history. Uses the Ecommerce Backend REST API.

## Getting Started

1) Copy environment file
```
cp .env.example .env
```

2) Set NEXT_PUBLIC_API_BASE_URL to point to your backend.
- For local dev with backend at http://localhost:3001 and API path /api:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
```

3) Install deps and run:
```
npm install
npm run dev
```

Open http://localhost:3000

## Features
- Registration/Login
- Product browse, search, filter
- Product details
- Cart sidebar with quantity management
- Checkout flow with shipping address
- Order history and order details
- Responsive design and clean UI (primary #1a73e8, accent #34a853, secondary #fbbc05)
