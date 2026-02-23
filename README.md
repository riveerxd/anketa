# WA Anketa - Hlasovací Aplikace

Jednoduchá webová anketa o jedné otázce s možností hlasování, zobrazení výsledků a administrátorského resetu.

## Otázka ankety

**"Kolik šálků kávy denně je ještě normální?"**

| Možnost | Text odpovědi |
|---------|---------------|
| A | 0 - Káva je pro slabochy |
| B | 1-2 - Rozumná dávka |
| C | 3-4 - Produktivní závislák |
| D | 5+ - Krev je jen nosič kofeinu |

---

## Wireframe

```
┌─────────────────────────────────────────────────────────────────┐
│                         HEADER                                  │
│                   ☕ Kávová Anketa ☕                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │                                                     │     │
│    │    Kolik šálků kávy denně je ještě normální?       │     │
│    │                                                     │     │
│    │    ○ A) 0 - Káva je pro slabochy                   │     │
│    │    ○ B) 1-2 - Rozumná dávka                        │     │
│    │    ○ C) 3-4 - Produktivní závislák                 │     │
│    │    ○ D) 5+ - Krev je jen nosič kofeinu             │     │
│    │                                                     │     │
│    │    ┌──────────────┐  ┌────────────────────┐        │     │
│    │    │  HLASOVAT    │  │  ZOBRAZIT VÝSLEDKY │        │     │
│    │    └──────────────┘  └────────────────────┘        │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │              VÝSLEDKY (po hlasování)                │     │
│    │                                                     │     │
│    │    A) 0 - Káva je pro slabochy                     │     │
│    │    ████░░░░░░░░░░░░░░░░  12 hlasů (15%)            │     │
│    │                                                     │     │
│    │    B) 1-2 - Rozumná dávka                          │     │
│    │    ████████████░░░░░░░░  35 hlasů (44%)            │     │
│    │                                                     │     │
│    │    C) 3-4 - Produktivní závislák                   │     │
│    │    ██████████░░░░░░░░░░  28 hlasů (35%)            │     │
│    │                                                     │     │
│    │    D) 5+ - Krev je jen nosič kofeinu               │     │
│    │    ██░░░░░░░░░░░░░░░░░░   5 hlasů (6%)             │     │
│    │                                                     │     │
│    │    Celkem: 80 hlasů                                │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                                                                 │
│    ┌─────────────────────────────────────────────────────┐     │
│    │              ADMIN RESET                            │     │
│    │                                                     │     │
│    │    Token: [________________]  [ RESETOVAT ]         │     │
│    │                                                     │     │
│    └─────────────────────────────────────────────────────┘     │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                         FOOTER                                  │
│                    © 2026 WA Anketa                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Deployment Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                           HOST MACHINE                               │
│                                                                      │
│    ┌──────────────────────────────────────────────────────────┐     │
│    │                    DOCKER NETWORK                         │     │
│    │                    (anketa_network)                       │     │
│    │                                                           │     │
│    │   ┌─────────────────────┐    ┌─────────────────────┐    │     │
│    │   │                     │    │                     │    │     │
│    │   │   NEXT.JS APP       │    │   MYSQL 8.0         │    │     │
│    │   │   (anketa_app)      │    │   (anketa_db)       │    │     │
│    │   │                     │    │                     │    │     │
│    │   │   Port: 3000        │───▶│   Port: 3306        │    │     │
│    │   │                     │    │                     │    │     │
│    │   │   /app              │    │   /var/lib/mysql    │    │     │
│    │   │                     │    │         │           │    │     │
│    │   └─────────────────────┘    └─────────│───────────┘    │     │
│    │             │                          │                 │     │
│    └─────────────│──────────────────────────│─────────────────┘     │
│                  │                          │                        │
│                  ▼                          ▼                        │
│         ┌────────────────┐         ┌────────────────┐               │
│         │ localhost:3000 │         │ mysql_data     │               │
│         │ (exposed port) │         │ (volume)       │               │
│         └────────────────┘         └────────────────┘               │
│                  │                                                   │
└──────────────────│───────────────────────────────────────────────────┘
                   │
                   ▼
          ┌────────────────┐
          │   USER         │
          │   BROWSER      │
          │                │
          │   HTTP/HTTPS   │
          └────────────────┘
```

---

## Struktura projektu

```
wa_anketa/
├── docker-compose.yml          # Docker orchestrace
├── .env                        # Environment proměnné (gitignore!)
├── .env.example                # Vzor env souboru
├── .gitignore
├── README.md                   # Tato dokumentace
│
├── docs/
│   ├── wireframe.drawio        # Editovatelný wireframe
│   └── deployment.drawio       # Editovatelný deployment diagram
│
├── app/                        # Next.js aplikace
│   ├── Dockerfile
│   ├── package.json
│   ├── next.config.js
│   ├── tsconfig.json
│   │
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Hlavní stránka
│   │   │   ├── globals.css     # Globální styly
│   │   │   │
│   │   │   └── api/
│   │   │       ├── vote/
│   │   │       │   └── route.ts    # POST /api/vote
│   │   │       ├── results/
│   │   │       │   └── route.ts    # GET /api/results
│   │   │       └── reset/
│   │   │           └── route.ts    # POST /api/reset
│   │   │
│   │   ├── components/
│   │   │   ├── VoteForm.tsx        # Formulář hlasování
│   │   │   ├── Results.tsx         # Zobrazení výsledků
│   │   │   └── ResetForm.tsx       # Admin reset
│   │   │
│   │   └── lib/
│   │       └── db.ts               # MySQL connection pool
│   │
│   └── logs/                   # Aplikační logy (gitignore)
│
└── mysql/
    └── init.sql                # Inicializační SQL skript
```

---

## API Endpointy

### `GET /`
**Popis:** Hlavní stránka aplikace
**Response:** HTML stránka s formulářem

---

### `GET /api/results`
**Popis:** Získání aktuálních výsledků hlasování
**Response:**
```json
{
  "success": true,
  "data": {
    "question": "Kolik šálků kávy denně je ještě normální?",
    "options": [
      { "id": 1, "label": "A", "text": "0 - Káva je pro slabochy", "votes": 12 },
      { "id": 2, "label": "B", "text": "1-2 - Rozumná dávka", "votes": 35 },
      { "id": 3, "label": "C", "text": "3-4 - Produktivní závislák", "votes": 28 },
      { "id": 4, "label": "D", "text": "5+ - Krev je jen nosič kofeinu", "votes": 5 }
    ],
    "totalVotes": 80
  }
}
```

---

### `POST /api/vote`
**Popis:** Odeslání hlasu
**Request Body:**
```json
{
  "optionId": 2
}
```
**Response (success):**
```json
{
  "success": true,
  "message": "Hlas byl zaznamenán",
  "data": { /* stejné jako GET /api/results */ }
}
```
**Response (error):**
```json
{
  "success": false,
  "error": "Neplatná volba"
}
```

---

### `POST /api/reset`
**Popis:** Reset všech hlasů (vyžaduje token)
**Request Body:**
```json
{
  "token": "tajny-admin-token-123"
}
```
**Response (success):**
```json
{
  "success": true,
  "message": "Hlasování bylo resetováno"
}
```
**Response (error - špatný token):**
```json
{
  "success": false,
  "error": "Neplatný token"
}
```

---

## Databázové schéma

```sql
-- Tabulka možností odpovědí
CREATE TABLE options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label CHAR(1) NOT NULL,           -- A, B, C, D
    text VARCHAR(255) NOT NULL,        -- Text odpovědi
    votes INT DEFAULT 0                -- Počet hlasů
);

-- Počáteční data
INSERT INTO options (label, text, votes) VALUES
    ('A', '0 - Káva je pro slabochy', 0),
    ('B', '1-2 - Rozumná dávka', 0),
    ('C', '3-4 - Produktivní závislák', 0),
    ('D', '5+ - Krev je jen nosič kofeinu', 0);
```

---

## Environment proměnné

| Proměnná | Popis | Příklad |
|----------|-------|---------|
| `MYSQL_HOST` | Hostname MySQL serveru | `anketa_db` |
| `MYSQL_PORT` | Port MySQL | `3306` |
| `MYSQL_DATABASE` | Název databáze | `anketa` |
| `MYSQL_USER` | Uživatel databáze | `anketa_user` |
| `MYSQL_PASSWORD` | Heslo databáze | `secret123` |
| `MYSQL_ROOT_PASSWORD` | Root heslo MySQL | `rootsecret` |
| `RESET_TOKEN` | Token pro reset hlasování | `tajny-admin-token-123` |

---

## Spuštění aplikace

```bash
# 1. Zkopíruj a uprav env soubor
cp .env.example .env

# 2. Spusť kontejnery
docker-compose up -d

# 3. Aplikace běží na
open http://localhost:3000
```

---

## Funkční požadavky - checklist

- [x] **F1** Hlasování
  - [x] Zobrazení otázky a 4 možností
  - [x] Výběr jedné možnosti
  - [x] Uložení hlasu na server
  - [x] Možnost zobrazit výsledky bez hlasování

- [x] **F2** Zobrazení výsledků
  - [x] Aktuální výsledky bez hlasování
  - [x] Počet hlasů pro každou možnost
  - [x] Sdílená data mezi uživateli (MySQL)
  - [x] Perzistence po restartu (Docker volume)

- [x] **F3** Reset hlasování
  - [x] Reset možný pouze s tokenem
  - [x] Token uložen na serveru (env proměnná)
  - [x] Správný token = vynulování hlasů
  - [x] Špatný token = zamítnutí

---

## Autor

WA Anketa - Školní projekt 2026
