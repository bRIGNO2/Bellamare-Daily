# 🗞️ Bellamare Daily

Web app per digitalizzare l'ordinazione dei quotidiani nel campeggio Bellamare (~1600 piazzole). Pensata per un'utenza adulta/anziana: nessuna password, pochi passaggi, pulsanti grandi. Un ordine si completa in meno di un minuto.

> MVP reale, non una demo: struttura professionale, separazione delle responsabilità, regole di business applicate lato server.

---

## Indice

- [Panoramica funzionale](#panoramica-funzionale)
- [Stack tecnologico](#stack-tecnologico)
- [Struttura del progetto](#struttura-del-progetto)
- [Documentazione](#documentazione)
- [Requisiti](#requisiti)
- [Installazione ed avvio](#installazione-ed-avvio)
- [Dati demo](#dati-demo)
- [Regole di business chiave](#regole-di-business-chiave)
- [Roadmap futura](#roadmap-futura)

---

## Panoramica funzionale

**Ospite del campeggio:**
1. Scansiona il QR Code → apre la web app
2. Si registra con Nome + Numero piazzola (nessuna password)
3. Ordina uno o più quotidiani per il giorno successivo
4. Riceve il giornale in piazzola; il pagamento avviene di persona

**Amministratore:**
- Dashboard con riepilogo ordini del giorno successivo
- Gestione pagamenti (segna come ricevuti, ricerca per piazzola)
- Lista acquisto aggregata per il giornalaio
- Lista di consegna ordinata per piazzola, con spunta consegnato/non consegnato

## Stack tecnologico

| Livello | Tecnologia |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| API | REST (JSON) |
| Autenticazione | Cookie httpOnly firmati (JWT) — nessuna password lato cliente |

## Struttura del progetto

```
bellamare-daily/
├── docs/               # analisi, architettura, schema DB, flussi utente, API
├── backend/            # API Express + Prisma
│   ├── prisma/          # schema.prisma, seed.ts
│   └── src/
│       ├── config/       # env, prisma client
│       ├── middleware/   # auth cliente/admin, error handler
│       ├── routes/       # definizione endpoint REST
│       ├── controllers/  # gestione richiesta/risposta
│       ├── services/     # logica di business (cutoff, stati ordine, report)
│       └── utils/        # jwt, cutoff orario, asyncHandler
└── frontend/            # SPA React
    └── src/
        ├── pages/client/  # Benvenuto, Home, Ordina, I miei ordini, Profilo
        ├── pages/admin/   # Login, Dashboard, Pagamenti, Acquisti, Consegne
        ├── components/    # UI condivisa (Button, Card, Input...)
        ├── context/       # sessione cliente e sessione admin
        └── lib/           # client HTTP, tipi condivisi
```

## Documentazione

Prima del codice, il progetto è stato analizzato e progettato in `docs/`:

1. [`01-requirements.md`](docs/01-requirements.md) — Analisi dei requisiti
2. [`02-architecture.md`](docs/02-architecture.md) — Architettura completa
3. [`03-database-diagram.md`](docs/03-database-diagram.md) — Diagramma e vincoli del database
4. [`04-user-flows.md`](docs/04-user-flows.md) — Flussi utente dettagliati
5. [`05-api-list.md`](docs/05-api-list.md) — Elenco completo delle API REST

## Requisiti

- Node.js ≥ 18
- PostgreSQL ≥ 14 (locale o gestito, es. Supabase/Railway/Neon)
- npm

## Installazione ed avvio

### 1. Database

Crea un database PostgreSQL vuoto, ad esempio:

```bash
createdb bellamare_daily
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Modifica .env con la tua stringa DATABASE_URL e i tuoi secret JWT

npm install
npm run prisma:migrate     # crea le tabelle
npm run prisma:seed        # popola giornali demo, admin demo, cliente demo
npm run dev                # avvia l'API su http://localhost:4000
```

### 3. Frontend

In un secondo terminale:

```bash
cd frontend
cp .env.example .env
# VITE_API_URL deve puntare al backend (default http://localhost:4000/api)

npm install
npm run dev                # avvia la SPA su http://localhost:5173
```

### 4. Accesso

- **App cliente:** [http://localhost:5173](http://localhost:5173) → registrazione senza password
- **Pannello admin:** [http://localhost:5173/admin/login](http://localhost:5173/admin/login)

## Dati demo

Il seed (`npm run prisma:seed` nel backend) crea:

| Elemento | Valore |
|---|---|
| Giornali | Corriere della Sera, La Repubblica, Gazzetta dello Sport, Il Sole 24 Ore |
| Admin | username `admin` / password `bellamare2026` (configurabile via `.env`) |
| Cliente demo | Mario Rossi, piazzola 42 |

⚠️ Cambia la password admin prima di andare in produzione.

## Regole di business chiave

- **Nessun pagamento online**: il pagamento è sempre raccolto di persona dall'amministratore; l'ordine passa da `WAITING_PAYMENT` a `PAID` solo dopo conferma manuale.
- **Cutoff ordini alle 19:00** del giorno precedente alla consegna: dopo quell'ora non è possibile creare né annullare ordini. La regola è verificata **lato backend** (`backend/src/utils/cutoff.ts`), non solo sull'interfaccia.
- **Ciclo di vita ordine**: `CREATED → WAITING_PAYMENT → PAID → PREPARING → DELIVERING → COMPLETED` (oppure `CANCELLED` prima del cutoff).
- **Sessione cliente persistente**: cookie httpOnly di lunga durata, nessun login ripetuto ad ogni visita.

## Roadmap futura

- Notifiche (SMS/WhatsApp) quando l'ordine cambia stato
- Scelta della data di consegna oltre "domani"
- Pagamenti elettronici opzionali (v2)
- Multi-lingua per ospiti stranieri
- App PWA installabile con icona in home screen

---

Sviluppato come MVP reale per la stagione del campeggio Bellamare. 🌊
