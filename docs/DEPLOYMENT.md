# Deployment Guide - Kavova Anketa

Tento dokument popisuje krok za krokem jak nasadit zmeny do produkce.

---

## Postup nasazeni zmen

### Krok 1: Uprava kodu lokalne

1. Otevrete projekt v editoru
2. Proved'te potrebne zmeny v kodu
3. Lokalne otestujte:
   ```bash
   docker compose up -d --build
   ```
4. Overite na `http://localhost:3000`

### Krok 2: Commit a push

```bash
# Pridejte zmenene soubory
git add .

# Vytvorte commit
git commit -m "Popis zmeny"

# Odeslani na GitHub
git push origin master
```

### Krok 3: Automaticky deploy

Po push se automaticky spusti GitHub Actions workflow:

1. Prejdete na GitHub repo → **Actions** tab
2. Uvidite bezici workflow "Deploy"
3. Pockejte cca 1-2 minuty
4. Zelena fajfka = deploy uspesny

### Krok 4: Overeni na produkci

1. Otevrete `http://VAS_VPS_IP:3000`
2. Overite ze zmeny jsou viditelne
3. Zkontrolujte funkcnost (hlasovani, vysledky)

---

## GitHub Actions Workflow

Workflow soubor: `.github/workflows/deploy.yml`

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

| Secret | Popis |
|--------|-------|
| `VPS_HOST` | IP adresa VPS serveru |
| `VPS_USER` | SSH uzivatel (napr. root) |
| `VPS_SSH_KEY` | Privatni SSH klic |
| `VPS_PATH` | Cesta k repu na VPS |

---

## Monitoring s UptimeRobot

Aplikace je monitorovana sluzbou UptimeRobot pro zajisteni dostupnosti 24/7.

### Nastaveni

1. Registrace na [uptimerobot.com](https://uptimerobot.com)
2. Pridani noveho monitoru:
   - **Monitor Type:** HTTP(s)
   - **Friendly Name:** Kavova Anketa
   - **URL:** `http://VAS_VPS_IP:3000/api/results`
   - **Monitoring Interval:** 5 minutes
3. Nastaveni alertu:
   - **Alert Contact:** Vas email
   - Volitelne: SMS, Slack, webhook

### Jak to funguje

- UptimeRobot kazdych 5 minut posle HTTP request na `/api/results`
- Pokud server neodpovi nebo vrati chybu, dostanete email
- V dashboardu vidite historii dostupnosti a response time

### Co delat pri vypadu

1. Overit ze VPS bezi: `ssh user@VPS_IP`
2. Zkontrolovat kontejnery: `docker ps`
3. Restart aplikace: `docker compose up -d --build`
4. Zkontrolovat logy: `docker compose logs -f`

---

## Struktura projektu

```
wa_anketa/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD workflow
├── app/                    # Next.js aplikace
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx    # Hlavni stranka
│   │   │   ├── about/      # O ankete
│   │   │   └── api/        # API endpointy
│   │   └── lib/
│   │       └── db.ts       # Pripojeni k DB
│   └── Dockerfile
├── mysql/
│   └── init.sql            # Inicializace DB
├── docs/                   # Dokumentace
├── docker-compose.yml      # Docker orchestrace
└── .env                    # Environment promenne
```

---

## Casty problemy

### Deploy selhal

1. Zkontrolujte GitHub Actions logy
2. Overite SSH pristup: `ssh -i ~/.ssh/key user@VPS_IP`
3. Zkontrolujte secrets v GitHub repo

### Aplikace nebezi

```bash
# Na VPS:
docker compose logs -f app
docker compose logs -f db
```

### Databaze se neinicializovala

```bash
# Smazat volume a znovu vytvorit
docker compose down -v
docker compose up -d
```

---

## Uzitecne prikazy

| Akce | Prikaz |
|------|--------|
| Start | `docker compose up -d` |
| Stop | `docker compose down` |
| Rebuild | `docker compose up -d --build` |
| Logy | `docker compose logs -f` |
| Reset DB | `docker compose down -v && docker compose up -d` |
| Status | `docker ps` |
