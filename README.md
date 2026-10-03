# GOLO Claim Offer App

A small customer application where users can browse nearby merchant offers, view details,
register/login, claim an offer to get a unique claim code, and view their claim history.
A backend API lets a merchant redeem a valid claim.

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React (Vite), React Router, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (`jsonwebtoken`), password hashing with `bcryptjs` |

## Features
- Public offer listing and offer details (image, merchant, prices, discount %, validity, terms, quantity)
- Customer registration, login and logout (JWT)
- Claim an offer (login required) with a unique claim code, e.g. `GOLO-7F82K9`
- My Claims page with statuses: Claimed, Redeemed, Expired
- Merchant redemption API: `POST /api/claims/:claimCode/redeem`
- Expired and sold-out offers are shown clearly and cannot be claimed
- Consistent JSON error responses

## Project Structure
```
claim_offer_app/
├── backend/
│   └── src/
│       ├── config/        database connection
│       ├── models/        Customer, Merchant, Offer, Claim
│       ├── controllers/   auth, offer, claim logic
│       ├── routes/        route definitions
│       ├── middleware/    JWT auth, error handler
│       ├── utils/         claim code generator
│       ├── seed.js        dummy data script
│       └── server.js
└── frontend/react/
    └── src/
        ├── pages/         OfferList, OfferDetails, Login, Register, MyClaims, ...
        ├── components/    Navbar, OfferCard, ProtectedRoute
        ├── context/       AuthContext
        ├── utils/         helper functions
        └── api.js         single place for all API calls
```
<<VERIFY: make this match your real folders>>

## Setup and Run

### Prerequisites
- Node.js 18+
- MongoDB (local installation or a MongoDB Atlas connection string)

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env     # then edit .env with your values
npm run seed             # <<VERIFY: your seed command, e.g. node src/seed.js>>
npm run dev              # runs on http://localhost:5001
```

### 2. Frontend
```bash
cd frontend/react
npm install
cp .env.example .env     # optional, defaults to http://localhost:5001/api
npm run dev              # runs on http://localhost:5173
```

### Environment Variables (backend)
| Variable | Description |
|---|---|
| `PORT` | Server port |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign JWTs |
| `JWT_EXPIRES_IN` | Token lifetime, e.g. `7d` |

### Seed Data
The seed script creates dummy merchants and offers, including one **expired** offer and
<<VERIFY: any sold-out offer>> for testing. Register a customer through the UI to log in.

## Database Design

### Entities and Relationships
```
Merchant 1 ───< Offer 1 ───< Claim >─── 1 Customer
```
- One merchant has many offers.
- One offer has many claims.
- One customer has many claims.
- A claim links exactly one customer to exactly one offer.

| Entity | Key fields |
|---|---|
| Customer | name, email, mobile, password (hashed), createdAt |
| Merchant | storeName, location, contact info |
| Offer | merchant (ref), title, description, image, productName, originalPrice, offerPrice, startDate, expiryDate, status, availableQuantity, terms |
| Claim | customer (ref), offer (ref), claimCode, claimDate, status, redeemedDate |

### Indexing and Design Decisions
- **`Customer.email` unique index**: prevents duplicate accounts and speeds up login lookups.
- **`Claim.claimCode` unique index**: guarantees unique codes and gives fast lookup during redemption.
- **Compound unique index on `Claim (customer, offer)`**: enforces "one claim per customer per offer"
  **at the database level**, so two simultaneous requests cannot create duplicate claims.
  The application also checks first to return a friendly error.
- **Index on `Claim.customer`**: fast "My Claims" queries. <<VERIFY: keep only if you added it>>
- **Expired status is derived**, not stored by a background job: a claim still marked `Claimed` whose
  offer's `expiryDate` has passed is returned and shown as `Expired`. This avoids scheduled jobs
  and can never go out of date.
- **Passwords** are hashed with bcrypt and never stored or returned as plain text.

## Business Rules

**Claiming an offer** (`POST /api/offers/:id/claim`), checked in order:
1. Customer is authenticated (valid JWT)
2. Offer exists
3. Offer is active and not expired
4. Offer has available quantity <<VERIFY>>
5. Customer has not already claimed it
6. Claim is created with a unique claim code

**Redeeming a claim** (`POST /api/claims/:claimCode/redeem`):
1. Claim code exists
2. Claim belongs to the given offer (when `offerId` is supplied) <<VERIFY>>
3. Claim is not already redeemed
4. Offer has not expired
5. On success: status becomes `Redeemed` and `redeemedDate` is stored

## API Overview
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register a customer |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/offers` | No | List offers |
| GET | `/api/offers/:id` | No | Offer details |
| POST | `/api/offers/:id/claim` | Yes | Claim an offer |
| GET | `/api/my-claims` | Yes | Logged-in customer's claims |
| GET | `/api/claims/:claimCode` | <<VERIFY>> | Claim details by code |
| POST | `/api/claims/:claimCode/redeem` | No (demo) | Merchant redemption |

Full request/response details: [docs/API.md](docs/API.md)

## Testing Scenarios
| Scenario | Result |
|---|---|
| Successful claim | Claim created, unique code generated |
| Duplicate claim | Rejected with an error |
| Expired offer | Shown as expired, claim button disabled, API rejects it |
| Successful redemption | Status becomes Redeemed, redeemed date stored |
| Duplicate redemption | Rejected with an error |

All error cases from the brief (invalid login, missing fields, invalid claim code, unauthenticated
claim, malformed ids) return meaningful JSON errors without crashing the server.

## Assumptions and Limitations
- Offers and details are **public** to reduce friction; login is required only to claim.
- The redemption endpoint is **unauthenticated for demo purposes**. In production it would require
  merchant authentication (API key or merchant login).
- `/merchant/redeem` in the frontend is a demo-only page <<VERIFY: delete this line if you skipped the page>>.
- JWT is stored in `localStorage` for simplicity. A production app might prefer httpOnly cookies.
- "Nearby" is represented by the merchant's location text. Real geo-distance filtering is not implemented.

## Possible Improvements
Search and filters, pagination, rate limiting, automated tests, merchant login, geo-queries.