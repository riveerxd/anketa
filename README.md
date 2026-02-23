# Kávová Anketa

**Technická dokumentace**

**URL:** [https://anketa.riveer.cz](https://anketa.riveer.cz)
**Datum:** Únor 2026

---

## 1. Přehled projektu

Jednoduchá webová anketa s jednou otázkou, možností hlasování, zobrazení výsledků a administrátorským resetem. Každý uživatel může hlasovat pouze jednou.

**Otázka ankety:** "Kolik šálků kávy denně je ještě normální?"

| Možnost | Odpověď |
|---------|---------|
| A | 0 - Káva je pro slabochy |
| B | 1-2 - Rozumná dávka |
| C | 3-4 - Produktivní závislák |
| D | 5+ - Krev je jen nosič kofeinu |

## 2. Architektura aplikace

### Tech Stack

| Komponenta | Technologie |
|------------|-------------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Routes |
| Databáze | MySQL 8.0 |
| Kontejnerizace | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Reverzní proxy | Nginx |
| SSL | Let's Encrypt (Certbot) |
| Monitoring | UptimeRobot |

### Struktura projektu

```
wa_anketa/
├── .github/workflows/deploy.yml    # CI/CD pipeline
├── app/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx          # Root layout
│   │   │   ├── page.tsx            # Hlavní stránka
│   │   │   ├── about/page.tsx      # Stránka "O anketě"
│   │   │   ├── admin/page.tsx      # Admin reset (skrytá)
│   │   │   └── api/
│   │   │       ├── vote/route.ts       # POST - odeslání hlasu
│   │   │       ├── results/route.ts    # GET - výsledky
│   │   │       ├── reset/route.ts      # POST - reset hlasování
│   │   │       └── check-voted/route.ts # GET - kontrola hlasování
│   │   └── lib/
│   │       ├── db.ts               # MySQL connection pool
│   │       └── utils.ts            # Utility funkce (cn)
│   └── Dockerfile
├── mysql/init.sql                  # Inicializace databáze
└── docker-compose.yml
```

## 3. Wireframe aplikace

*[Viz soubor wireframe.drawio]*

**Popis sekcí:**

1. **Header** - Název aplikace s ikonou kávy
2. **Hlasovací formulář** - Otázka a 4 možnosti odpovědi (radio buttons)
3. **Tlačítka** - "Hlasovat" a "Zobrazit výsledky"
4. **Výsledky** - Progress bary s počtem hlasů a procenty
5. **Admin sekce** - Skrytý formulář pro reset s tokenem
6. **Footer** - Copyright a odkaz na stránku "O anketě"

## 4. Deployment diagram

*[Viz soubor deployment.drawio]*

### Komponenty infrastruktury

**VPS Server (Ubuntu)**

- Nginx jako reverzní proxy na portu 80/443
- Docker kontejnery ve vnitřní síti `anketa_network`

**Docker kontejnery:**

- `anketa_app` - Next.js aplikace (port 3000)
- `anketa_db` - MySQL databáze (port 3306)

**Externí služby:**

- Cloudflare DNS - správa domény
- UptimeRobot - monitoring dostupnosti
- GitHub Actions - automatický deploy

## 5. Databázové schéma

```sql
-- Tabulka možností odpovědí
CREATE TABLE options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label CHAR(1) NOT NULL,
    text VARCHAR(255) NOT NULL,
    votes INT DEFAULT 0
);

-- Tabulka hlasujících (ochrana proti dvojímu hlasování)
CREATE TABLE voters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voter_id VARCHAR(36) NOT NULL UNIQUE,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 6. API Endpointy

### GET /api/results

Vrací aktuální výsledky hlasování.

```json
{
  "success": true,
  "data": {
    "question": "Kolik šálků kávy denně je ještě normální?",
    "options": [
      {"id": 1, "label": "A", "text": "...", "votes": 12},
      {"id": 2, "label": "B", "text": "...", "votes": 35}
    ],
    "totalVotes": 47
  }
}
```

### POST /api/vote

Odešle hlas. Request: `{"optionId": 2}`

Odpovědi: 200 OK při úspěchu, 403 Forbidden pokud už hlasoval.

### POST /api/reset

Resetuje hlasy. Vyžaduje token: `{"token": "..."}`

### GET /api/check-voted

Vrací `{"hasVoted": true/false}`

## 7. Ochrana proti dvojímu hlasování

Systém používá kombinaci cookie a serverové validace.

### Postup

1. **První návštěva** - Uživatel dostane unikátní UUID v cookie `voter_id`
2. **Hlasování** - Server zkontroluje UUID v tabulce `voters`
3. **Nový uživatel** - UUID se uloží, hlas se započítá
4. **Existující** - Server vrátí chybu "Už jste hlasoval/a"
5. **Reset** - Smaže `voters` i hlasy, všichni mohou hlasovat znovu

```
Uživatel -> Cookie (voter_id: UUID)
                |
                v
          POST /api/vote
                |
                v
     SELECT FROM voters WHERE voter_id = ?
                |
     +----------+----------+
     |                     |
  Nenalezeno            Nalezeno
     |                     |
     v                     v
  INSERT voter        403 Forbidden
  UPDATE votes        "Už jste hlasoval/a"
     |
     v
  200 OK
```

## 8. CI/CD Pipeline

*[Viz soubor ci-cd-workflow.drawio]*

### Postup nasazení

1. Vývojář upraví kód lokálně
2. `git push origin master`
3. GitHub Actions detekuje push
4. Workflow se připojí na VPS přes SSH
5. Stáhne kód (`git pull`)
6. Restartuje kontejnery (`docker compose up -d --build`)
7. Změny jsou live do 2 minut

### GitHub Secrets

| Secret | Popis |
|--------|-------|
| VPS_HOST | IP adresa serveru |
| VPS_USER | SSH uživatel |
| VPS_SSH_KEY | Privátní SSH klíč |
| VPS_PATH | Cesta k repozitáři |

## 9. Monitoring

**Služba:** UptimeRobot (free tier)

**Veřejná status stránka:** [https://stats.uptimerobot.com/1Bty2QQ4I9](https://stats.uptimerobot.com/1Bty2QQ4I9)

**Dashboard:** [https://dashboard.uptimerobot.com](https://dashboard.uptimerobot.com)

| Parametr | Hodnota |
|----------|---------|
| Monitorovaná URL | https://anketa.riveer.cz/api/results |
| Typ | HTTP(s) |
| Interval | 5 minut |
| Upozornění | Email |

### Přístup k monitoringu

1. Přihlaste se na [uptimerobot.com](https://uptimerobot.com)
2. V dashboardu uvidíte stav monitoru "Kávová Anketa"
3. Historie dostupnosti a response time jsou v detailu monitoru

### Reakce na výpadek

1. Připojit na VPS: `ssh user@server`
2. Zkontrolovat: `docker ps`
3. Logy: `docker compose logs -f`
4. Restart: `docker compose up -d --build`

## 10. Produkční prostředí

| Položka | Hodnota |
|---------|---------|
| URL | https://anketa.riveer.cz |
| Server | VPS (Ubuntu) |
| DNS | Cloudflare |
| SSL | Let's Encrypt |
| Proxy | Nginx |

## 11. Nahlašování chyb

Uživatelé mohou nahlásit chyby přes GitHub Issues na stránce **O anketě** (`/about`).

| Položka | Hodnota |
|---------|---------|
| GitHub repozitář | [https://github.com/riveerxd/anketa](https://github.com/riveerxd/anketa) |
| Nový issue | [https://github.com/riveerxd/anketa/issues/new](https://github.com/riveerxd/anketa/issues/new) |

**Při nahlašování uvádějte:**

- Popis problému
- Kroky k reprodukci chyby
- Prohlížeč a zařízení
- Screenshot (pokud je to možné)

---

*Dokumentace vytvořena v rámci školního projektu, únor 2026*
