# Bellamare Daily — Schema Database (PostgreSQL / Prisma)

## Diagramma ER (testuale)

```
┌────────────────────┐        ┌──────────────────────┐
│       User          │        │      Newspaper        │
├────────────────────┤        ├──────────────────────┤
│ id (PK)             │        │ id (PK)                │
│ nome                │        │ nome                   │
│ cognome  (nullable) │        │ prezzo                 │
│ telefono (nullable) │        │ attivo                 │
│ piazzola            │        │ createdAt               │
│ createdAt           │        └──────────┬─────────────┘
└─────────┬──────────┘                    │
          │ 1                             │ 1
          │                                │
          │ N                              │ N
┌─────────▼──────────┐        ┌────────────▼─────────────┐
│       Order          │        │      OrderItem            │
├────────────────────┤ 1    N ├──────────────────────────┤
│ id (PK)              │◀──────│ id (PK)                    │
│ userId (FK → User)   │        │ orderId (FK → Order)       │
│ dataConsegna          │        │ newspaperId (FK→Newspaper) │
│ stato (enum)          │        │ quantita                   │
│ totale                │        │ prezzoUnitario              │
│ createdAt              │        └────────────────────────────┘
└─────────┬────────────┘
          │ 1
          │
          │ 1 (o 0..1)
┌─────────▼──────────┐
│      Payment          │
├────────────────────┤
│ id (PK)               │
│ orderId (FK → Order, unique)│
│ importo                │
│ stato                  │
│ dataPagamento (nullable)│
│ createdAt               │
└────────────────────────┘

┌────────────────────┐
│       Admin          │   (indipendente, per login pannello)
├────────────────────┤
│ id (PK)               │
│ username (unique)      │
│ passwordHash            │
│ createdAt                │
└────────────────────────┘
```

## Vincoli principali

- `Order.userId` → FK obbligatoria verso `User` (`onDelete: Restrict`)
- `Order.stato` → enum `OrderStatus` (CREATED, WAITING_PAYMENT, PAID, PREPARING, DELIVERING, COMPLETED, CANCELLED)
- `OrderItem.orderId` → FK verso `Order` (`onDelete: Cascade`, se l'ordine viene eliminato spariscono le righe)
- `OrderItem.newspaperId` → FK verso `Newspaper` (`onDelete: Restrict`, non si può eliminare un giornale referenziato)
- `Payment.orderId` → **unique** FK verso `Order` (relazione 1:1, un ordine ha al massimo un pagamento)
- `Newspaper.prezzo` e `OrderItem.prezzoUnitario` → `Decimal` per evitare errori di arrotondamento
- Indici: `User.piazzola`, `Order.dataConsegna`, `Order.stato` (query dashboard frequenti su questi campi)

## Perché `prezzoUnitario` è duplicato in `OrderItem`

Il prezzo del giornale può cambiare nel tempo. Salvare lo storico del prezzo al momento dell'ordine garantisce che il totale di un ordine passato resti corretto anche se in futuro il prezzo del quotidiano cambia.
