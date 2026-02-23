# Kavova Anketa - Technicka dokumentace

**Projekt:** Webova hlasovaci aplikace
**URL:** https://anketa.riveer.cz
**Autor:** [Vase jmeno]
**Datum:** Unor 2026

---

## 1. Prehled projektu

Jednoducha webova anketa s jednou otazkou, moznosti hlasovani, zobrazeni vysledku a administrátorskym resetem. Kazdy uzivatel muze hlasovat pouze jednou.

**Otazka ankety:** "Kolik salku kavy denne je jeste normalni?"

| Moznost | Odpoved |
|---------|---------|
| A | 0 - Kava je pro slabochy |
| B | 1-2 - Rozumna davka |
| C | 3-4 - Produktivni zavislak |
| D | 5+ - Krev je jen nosic kofeinu |

---

## 2. Architektura aplikace

### Tech Stack

| Komponenta | Technologie |
|------------|-------------|
| Frontend | Next.js 14, React 18, Tailwind CSS |
| Backend | Next.js API Routes |
| Databaze | MySQL 8.0 |
| Kontejnerizace | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Reverzni proxy | Nginx |
| SSL | Let's Encrypt (Certbot) |
| Monitoring | UptimeRobot |

### Struktura projektu

```
wa_anketa/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── app/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx        # Hlavni stranka
│   │   │   ├── about/          # Stranka "O ankete"
│   │   │   └── api/
│   │   │       ├── vote/       # POST - odeslani hlasu
│   │   │       ├── results/    # GET - vysledky
│   │   │       ├── reset/      # POST - reset hlasovani
│   │   │       └── check-voted/ # GET - kontrola hlasovani
│   │   └── lib/
│   │       └── db.ts           # Pripojeni k databazi
│   └── Dockerfile
├── mysql/
│   └── init.sql                # Inicializace databaze
├── docker-compose.yml
└── docs/
    ├── wireframe.drawio
    ├── deployment.drawio
    └── ci-cd-workflow.drawio
```

---

## 3. Wireframe aplikace

![Wireframe](wireframe.png)

**Popis jednotlivych sekci:**

1. **Header** - Nazev aplikace s ikonou
2. **Hlasovaci formular** - Otazka a 4 moznosti odpovedi
3. **Tlacitka** - "Hlasovat" a "Vysledky"
4. **Vysledky** - Progress bary s poctem hlasu a procenty
5. **Admin sekce** - Skryty formular pro reset s tokenem
6. **Footer** - Copyright a odkaz na stranku "O ankete"

---

## 4. Deployment diagram

![Deployment](deployment.png)

### Komponenty infrastruktury

**VPS Server (Ubuntu)**
- Nginx jako reverzni proxy na portu 80/443
- Docker kontejnery ve vnitrni siti

**Docker kontejnery:**
- `anketa_app` - Next.js aplikace na portu 3000
- `anketa_db` - MySQL databaze na portu 3306

**Externi sluzby:**
- Cloudflare DNS - sprava domeny
- UptimeRobot - monitoring dostupnosti
- GitHub Actions - automaticky deploy

---

## 5. Databazove schema

```sql
-- Tabulka moznosti odpovedi
CREATE TABLE options (
    id INT PRIMARY KEY AUTO_INCREMENT,
    label CHAR(1) NOT NULL,
    text VARCHAR(255) NOT NULL,
    votes INT DEFAULT 0
);

-- Tabulka hlasujicich (ochrana proti dvojimu hlasovani)
CREATE TABLE voters (
    id INT PRIMARY KEY AUTO_INCREMENT,
    voter_id VARCHAR(36) NOT NULL UNIQUE,
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 6. API Endpointy

### GET /api/results

Vraci aktualni vysledky hlasovani.

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "Kolik salku kavy denne je jeste normalni?",
    "options": [
      {"id": 1, "label": "A", "text": "0 - Kava je pro slabochy", "votes": 12},
      {"id": 2, "label": "B", "text": "1-2 - Rozumna davka", "votes": 35}
    ],
    "totalVotes": 47
  }
}
```

### POST /api/vote

Odesle hlas pro vybranou moznost.

**Request:**
```json
{"optionId": 2}
```

**Response (uspech):**
```json
{"success": true, "message": "Hlas byl zaznamenan", "data": {...}}
```

**Response (uz hlasoval):**
```json
{"success": false, "error": "Uz jste hlasoval/a", "alreadyVoted": true}
```

### POST /api/reset

Resetuje vsechny hlasy. Vyzaduje spravny token.

**Request:**
```json
{"token": "tajny-token"}
```

### GET /api/check-voted

Kontroluje jestli uzivatel uz hlasoval.

**Response:**
```json
{"hasVoted": true}
```

---

## 7. Ochrana proti dvojimu hlasovani

System pouziva kombinaci cookie a serverove validace.

### Jak to funguje

1. **Prvni navsteva** - Uzivatel dostane unikatni UUID ulozene v cookie `voter_id`
2. **Hlasovani** - Server zkontroluje UUID v tabulce `voters`
3. **Novy uzivatel** - UUID se ulozi do DB, hlas se zapocita
4. **Existujici UUID** - Server odmitne s chybou "Uz jste hlasoval/a"
5. **Reset** - Smaze tabulku `voters` i hlasy, vsichni mohou hlasovat znovu

### Technicka implementace

```
Uzivatel -> Cookie (voter_id: UUID)
              |
              v
         POST /api/vote
              |
              v
    SELECT * FROM voters WHERE voter_id = ?
              |
    +---------+---------+
    |                   |
  Nenalezeno         Nalezeno
    |                   |
    v                   v
 INSERT voter      403 Forbidden
 UPDATE votes      "Uz jste hlasoval/a"
    |
    v
 200 OK
```

### Omezeni

- Smazani cookies umozni opetovne hlasovani
- Pro jednoduchou anketu je to akceptovatelne reseni
- Pro vetsi zabezpeceni by bylo potreba prihlasovani uzivatelu

---

## 8. CI/CD Pipeline

![CI/CD Workflow](ci-cd-workflow.png)

### Postup nasazeni zmen

1. Vyvojar upravi kod lokalne
2. `git push origin master`
3. GitHub Actions detekuje push
4. Workflow se pripoji na VPS pres SSH
5. Stahne nejnovejsi kod (`git pull`)
6. Restartuje kontejnery (`docker compose up -d --build`)
7. Zmeny jsou live behem 1-2 minut

### GitHub Actions Workflow

```yaml
name: Deploy
on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd ${{ secrets.VPS_PATH }}
            git pull origin master
            docker compose up -d --build
```

### Potrebne GitHub Secrets

| Secret | Ucel |
|--------|------|
| VPS_HOST | IP adresa serveru |
| VPS_USER | SSH uzivatel |
| VPS_SSH_KEY | Privatni SSH klic |
| VPS_PATH | Cesta k repozitari na serveru |

---

## 9. Monitoring

### UptimeRobot

Sluzba UptimeRobot monitoruje dostupnost aplikace 24/7.

**Konfigurace:**
- **URL:** https://anketa.riveer.cz/api/results
- **Typ:** HTTP(s)
- **Interval:** 5 minut
- **Upozorneni:** Email pri nedostupnosti

### Jak funguje

1. Kazdy 5 minut posle HTTP GET request na `/api/results`
2. Ocekava odpoved 200 OK s validnim JSON
3. Pri chybe nebo timeoutu odesle email
4. Dashboard ukazuje historii dostupnosti a response time

### Reakce na vypadek

1. Pripojit se na VPS: `ssh user@server`
2. Zkontrolovat kontejnery: `docker ps`
3. Zobrazit logy: `docker compose logs -f`
4. Restart: `docker compose up -d --build`

---

## 10. Produkci nasazeni

### Server

- **Poskytovatel:** VPS
- **OS:** Ubuntu
- **Domena:** anketa.riveer.cz
- **DNS:** Cloudflare

### Nginx konfigurace

```nginx
server {
    listen 443 ssl;
    server_name anketa.riveer.cz;

    ssl_certificate /etc/letsencrypt/live/anketa.riveer.cz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/anketa.riveer.cz/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

server {
    listen 80;
    server_name anketa.riveer.cz;
    return 301 https://$server_name$request_uri;
}
```

### SSL Certifikat

Certifikat od Let's Encrypt, automaticka obnova pres Certbot.

```bash
certbot --nginx -d anketa.riveer.cz
```

---

## 11. Spusteni lokalniho vyvoje

```bash
# Klonovani repozitare
git clone https://github.com/riveerxd/anketa.git
cd anketa

# Vytvoreni .env souboru
cp .env.example .env

# Spusteni kontejneru
docker compose up -d --build

# Aplikace bezi na http://localhost:3000
```

### Uzitecne prikazy

| Prikaz | Akce |
|--------|------|
| `docker compose up -d` | Spusteni |
| `docker compose down` | Zastaveni |
| `docker compose logs -f` | Sledovani logu |
| `docker compose down -v` | Smazani vcetne dat |

---

## 12. Splnene pozadavky

### Funkcni pozadavky

- [x] **F1** Hlasovani - zobrazeni otazky, 4 moznosti, ulozeni hlasu
- [x] **F1** Moznost zobrazit vysledky bez hlasovani
- [x] **F2** Vysledky sdilene mezi uzivateli, perzistentni
- [x] **F3** Reset pouze s tokenem

### Technicke pozadavky

- [x] HTTP komunikace
- [x] HTML webova stranka
- [x] Data v MySQL (sdilena, perzistentni)
- [x] Zadne ukladani pouze do localStorage/JS

### Rozsireni

- [x] Ochrana proti dvojimu hlasovani
- [x] CI/CD pipeline
- [x] HTTPS s platnym certifikatem
- [x] Monitoring dostupnosti
- [x] Stranka "O ankete" s nahlasovanim chyb

---

*Dokumentace vytvorena v ramci skolniho projektu, unor 2026*
