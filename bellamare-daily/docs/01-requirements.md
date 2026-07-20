# Bellamare Daily — Analisi dei Requisiti

## 1. Contesto

Bellamare Daily digitalizza l'ordinazione dei quotidiani per gli ospiti di un campeggio da ~1600 piazzole. L'utenza è prevalentemente adulta/anziana → priorità assoluta: **semplicità**.

## 2. Attori

| Attore | Descrizione |
|---|---|
| **Ospite (cliente)** | Scansiona QR, si registra senza password, ordina giornali |
| **Amministratore** | Gestisce clienti, ordini, pagamenti, acquisti, consegne |

## 3. Requisiti funzionali

### 3.1 Cliente
- RF-01: Registrazione con solo Nome + Numero piazzola obbligatori (Cognome, Telefono opzionali)
- RF-02: Nessuna password — sessione persistente via cookie/token
- RF-03: Ordinare uno o più quotidiani con quantità per il giorno successivo
- RF-04: Consultare i propri ordini e il loro stato
- RF-05: Consultare/modificare il proprio profilo
- RF-06: Impossibilità di creare/annullare ordini dopo le 19:00 del giorno precedente

### 3.2 Amministratore
- RF-07: Login separato (protetto)
- RF-08: Dashboard con riepilogo ordini del giorno successivo
- RF-09: Gestione pagamenti (segna come "ricevuto", ricerca per piazzola)
- RF-10: Lista acquisto giornali aggregata per titolo
- RF-11: Lista di consegna ordinata per piazzola, con flag consegnato/non consegnato
- RF-12: Gestione anagrafica quotidiani (nome, prezzo, disponibilità)
- RF-13: Gestione stato ordine lungo l'intero ciclo di vita

## 4. Requisiti non funzionali

- RNF-01: Un ordine completabile in **meno di 60 secondi**
- RNF-02: UI con pulsanti grandi, testi leggibili, nessun linguaggio tecnico
- RNF-03: Nessun pagamento online — solo tracciamento manuale
- RNF-04: Vincolo orario (19:00) applicato **lato backend**, non solo UI
- RNF-05: Architettura professionale, separazione UI / business logic / data access
- RNF-06: Responsive, ottimizzato mobile (accesso via QR da smartphone)
- RNF-07: Accessibilità: contrasto elevato, font grandi, target touch ampi

## 5. Regole di business chiave

1. Un ordine nasce come `CREATED` → passa subito a `WAITING_PAYMENT`.
2. Solo ordini `PAID` possono passare a `PREPARING`.
3. Cutoff ordini: **19:00 del giorno precedente alla consegna**, verificato server-side ad ogni creazione/annullamento.
4. Il pagamento è sempre raccolto di persona dall'amministratore in piazzola.
5. Un utente è identificato in modo persistente da un token di sessione (no login classico).

## 6. Fuori scope (v1)

- Pagamenti online (carta, PayPal, ecc.)
- App nativa (solo web app responsive)
- Notifiche push/SMS (rimandato a versione futura)
- Multi-lingua (rimandato)
