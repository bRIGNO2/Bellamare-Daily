# Bellamare Daily — Flussi Utente

## 1. Primo accesso ospite

```
Scansione QR
   │
   ▼
Apertura Web App ──▶ Sessione esistente? ──Sì──▶ Home
   │
   No
   │
   ▼
Schermata "Benvenuto" ──▶ Form: Nome*, Piazzola*, Cognome, Telefono
   │
   ▼
[Inizia] ──▶ POST /api/auth/register ──▶ cookie sessione creato
   │
   ▼
Home cliente
```

## 2. Home cliente

Tre pulsanti grandi, nient'altro:

```
┌─────────────────────────────┐
│      🗞  Ordina giornale       │
├─────────────────────────────┤
│      📋  I miei ordini         │
├─────────────────────────────┤
│      👤  Il mio profilo        │
└─────────────────────────────┘
```

## 3. Flusso ordine (< 60 secondi)

```
Home ──▶ [Ordina giornale]
   │
   ▼
Data di consegna: "Domani" (preselezionata, unica opzione v1)
   │
   ▼
Lista giornali con [ - ] quantità [ + ] per ciascuno
   │
   ▼
Riepilogo automatico (totale, elenco)
   │
   ▼
[Conferma ordine] ──▶ POST /api/orders
   │
   ├─ Se ora > 19:00 del giorno prima → messaggio chiaro:
   │      "Non è più possibile ordinare per domani, riprova per il giorno dopo"
   │
   ▼
Schermata conferma: "Ordine ricevuto! Stato: in attesa di pagamento.
                      Passeremo in piazzola a ritirare i soldi."
```

## 4. I miei ordini

```
Home ──▶ [I miei ordini]
   │
   ▼
Lista ordini (più recente in alto), ciascuno con:
   - data di consegna
   - giornali e quantità
   - totale
   - stato (badge colorato, testo semplice es. "In attesa pagamento")
   │
   ▼
Se stato = CREATED/WAITING_PAYMENT e prima delle 19:00 → pulsante [Annulla ordine]
```

## 5. Profilo

```
Home ──▶ [Il mio profilo]
   │
   ▼
Visualizza/modifica: Nome, Cognome, Telefono, Piazzola
   │
   ▼
[Salva] ──▶ PUT /api/auth/me
```

## 6. Flusso amministratore

```
/admin/login ──▶ Username + Password ──▶ POST /api/admin/login
   │
   ▼
Dashboard
   │
   ├──▶ Pagamenti ──▶ ricerca per piazzola ──▶ [Segna come pagato]
   │
   ├──▶ Lista acquisto giornali (di domani, aggregata per titolo)
   │
   └──▶ Lista consegna (ordinata per piazzola) ──▶ [Consegnato] / [Non consegnato]
```

## 7. Ciclo di vita di un ordine (macchina a stati)

```
CREATED ──▶ WAITING_PAYMENT ──▶ PAID ──▶ PREPARING ──▶ DELIVERING ──▶ COMPLETED
     │                │
     └────────────────┴──▶ CANCELLED  (solo prima delle 19:00 del giorno prima)
```
