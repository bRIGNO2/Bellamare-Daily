# Bellamare Daily — Architettura

## 1. Vista d'insieme

```
┌─────────────────────┐        REST/JSON        ┌──────────────────────┐
│   FRONTEND (SPA)     │  ───────────────────▶  │   BACKEND (API)       │
│ React + Vite + TS    │  ◀───────────────────  │ Node + Express + TS   │
│ Tailwind CSS         │      cookie (JWT)        │  Prisma ORM           │
└─────────────────────┘                          └──────────┬───────────┘
                                                              │
                                                              ▼
                                                   ┌──────────────────────┐
                                                   │   PostgreSQL          │
                                                   └──────────────────────┘
```

## 2. Backend — struttura a livelli

```
routes        → definizione endpoint REST, validazione input
controllers   → orchestrazione richiesta/risposta (thin layer)
services      → LOGICA DI BUSINESS (cutoff orario, calcolo totali, cambi stato)
prisma/       → accesso al database (unico punto di contatto con la DB)
middleware    → autenticazione cliente/admin, error handling, validazione
```

Regola cardine: i controller non parlano mai direttamente con Prisma — passano sempre dai services. Questo isola la logica di business (es. regola delle 19:00) e la rende testabile.

## 3. Autenticazione

Due domini di sessione separati, entrambi via **cookie httpOnly firmato (JWT)**:

- `bd_session` → cliente (creato alla registrazione, nessuna password)
- `bd_admin_session` → amministratore (login con username/password)

Nessuna delle due sessioni è leggibile da JS lato client (protezione XSS). Il frontend chiama sempre `/api/auth/me` o `/api/admin/me` per sapere "chi sono".

## 4. Struttura cartelle

```
bellamare-daily/
├── docs/                     # documentazione di progetto
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── config/           # env, prisma client singleton
│       ├── middleware/       # auth, error handler
│       ├── routes/           # definizione rotte REST
│       ├── controllers/      # gestione req/res
│       ├── services/         # business logic
│       ├── utils/            # helper (cutoff, jwt, asyncHandler)
│       ├── types/            # tipi condivisi
│       ├── app.ts            # configurazione Express
│       └── server.ts         # entrypoint
└── frontend/
    └── src/
        ├── pages/client/      # Home, Registrazione, Ordina, MieiOrdini, Profilo
        ├── pages/admin/       # Login, Dashboard, Pagamenti, ListaAcquisto, ListaConsegna
        ├── components/        # componenti UI condivisi (Button grande, Card, ecc.)
        ├── components/admin/  # componenti specifici pannello admin
        ├── context/           # AuthContext cliente
        ├── hooks/              # useAuth, useOrders...
        └── lib/                # client HTTP (fetch wrapper)
```

## 5. Flusso del cutoff orario (regola critica)

Implementato in `backend/src/utils/cutoff.ts` e applicato in `orderService`:

1. Data di consegna richiesta = `D`.
2. Deadline ordini = `D - 1 giorno` alle **19:00** (fuso orario server, Europe/Rome).
3. Ad ogni `POST /orders` e `DELETE /orders/:id`: se `now > deadline(D)` → HTTP 409 `ORDER_CUTOFF_PASSED`.
4. La stessa funzione è riusata per validare le cancellazioni.

Questo garantisce che la regola non sia aggirabile manipolando il frontend.

## 6. Deployment (indicazioni)

- Backend: qualsiasi host Node (Render, Railway, VPS) + PostgreSQL gestito.
- Frontend: build statica (`vite build`) servita da CDN/hosting statico (Vercel, Netlify) con `VITE_API_URL` puntato al backend.
- Variabili sensibili (JWT secret, password admin, DB url) sempre in `.env`, mai committate.
