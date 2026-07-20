# Bellamare Daily — API REST

Base URL: `/api`
Autenticazione: cookie httpOnly (`bd_session` cliente, `bd_admin_session` admin)

## Auth cliente

| Metodo | Endpoint | Descrizione | Auth |
|---|---|---|---|
| POST | `/auth/register` | Crea profilo cliente, avvia sessione | pubblica |
| GET | `/auth/me` | Ritorna il profilo cliente corrente | cliente |
| PUT | `/auth/me` | Aggiorna il profilo (nome, cognome, telefono, piazzola) | cliente |
| POST | `/auth/logout` | Chiude la sessione | cliente |

## Giornali (pubblico/cliente)

| Metodo | Endpoint | Descrizione | Auth |
|---|---|---|---|
| GET | `/newspapers` | Elenco giornali attivi con prezzo | pubblica |

## Ordini (cliente)

| Metodo | Endpoint | Descrizione | Auth |
|---|---|---|---|
| POST | `/orders` | Crea un nuovo ordine (righe + data consegna) | cliente |
| GET | `/orders/my` | Elenco ordini dell'utente corrente | cliente |
| GET | `/orders/:id` | Dettaglio singolo ordine (solo proprietario) | cliente |
| DELETE | `/orders/:id` | Annulla ordine (solo se prima del cutoff) | cliente |

## Admin — autenticazione

| Metodo | Endpoint | Descrizione | Auth |
|---|---|---|---|
| POST | `/admin/login` | Login amministratore | pubblica |
| GET | `/admin/me` | Profilo admin corrente | admin |
| POST | `/admin/logout` | Logout admin | admin |

## Admin — dashboard e operatività

| Metodo | Endpoint | Descrizione | Auth |
|---|---|---|---|
| GET | `/admin/dashboard?date=YYYY-MM-DD` | Riepilogo: ordini, copie totali per giornale, pagamenti mancanti, consegne da fare | admin |
| GET | `/admin/orders?date=&stato=&piazzola=` | Elenco ordini filtrato | admin |
| PATCH | `/admin/orders/:id/status` | Cambia stato ordine (es. PREPARING → DELIVERING) | admin |
| GET | `/admin/payments?date=&piazzola=` | Elenco pagamenti da raccogliere | admin |
| POST | `/admin/payments/:orderId/mark-paid` | Segna pagamento come ricevuto | admin |
| GET | `/admin/payments/history` | Storico pagamenti ricevuti | admin |
| GET | `/admin/shopping-list?date=` | Lista acquisto giornali aggregata | admin |
| GET | `/admin/delivery-list?date=` | Lista di consegna ordinata per piazzola | admin |
| POST | `/admin/delivery/:orderId/delivered` | Segna un ordine come consegnato | admin |

## Admin — gestione anagrafica

| Metodo | Endpoint | Descrizione | Auth |
|---|---|---|---|
| GET | `/admin/newspapers` | Elenco completo giornali (anche non attivi) | admin |
| POST | `/admin/newspapers` | Crea nuovo giornale | admin |
| PUT | `/admin/newspapers/:id` | Modifica giornale (prezzo, disponibilità) | admin |
| GET | `/admin/customers?search=` | Ricerca clienti (nome/piazzola) | admin |

## Codici di errore rilevanti

| Codice | Significato |
|---|---|
| `ORDER_CUTOFF_PASSED` (409) | Tentativo di creare/annullare un ordine dopo le 19:00 del giorno prima |
| `NEWSPAPER_UNAVAILABLE` (400) | Giornale non attivo/non disponibile |
| `UNAUTHENTICATED` (401) | Sessione cliente/admin mancante o scaduta |
| `NOT_FOUND` (404) | Risorsa inesistente o non appartenente all'utente |
