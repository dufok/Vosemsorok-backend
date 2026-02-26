# Vosemsorok Backend

REST API for the Vosemsorok portfolio.
Serves project data from PostgreSQL and image files from disk.

---

## Stack

- **Node.js 24** + **Express** + **TypeScript**
- **Prisma ORM** → PostgreSQL 18
- **Systemd** service in production

---

## Project Structure

server/
├── src/
│ ├── app.ts # Express app, CORS config
│ ├── index.ts # Entry point, BigInt JSON fix
│ ├── routes/
│ │ ├── projects.ts # GET /api/projects, GET /api/projects/:slug
│ │ └── images.ts # GET /images/:slug/:filename
│ └── lib/
│ └── prisma.ts # Prisma client singleton
├── prisma/
│ └── schema.prisma # DB schema (projects + project_images)
├── generated/ # Prisma generated client (gitignored)
├── dist/ # Compiled output (gitignored)
├── .env # Environment variables (gitignored)
└── tsconfig.json

text

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/projects` | All projects with images, newest first |
| `GET` | `/api/projects?category=commercial` | Filter by category |
| `GET` | `/api/projects/:slug` | Single project by slug |
| `GET` | `/images/:slug/:filename` | Serve image file from disk |
| `GET` | `/health` | Health check → `{ status: "ok" }` |

### Project response shape

```json
{
  "id": 1,
  "slug": "02-2026-Roche-Stand",
  "title": "Roche Stand",
  "year": 2026,
  "month": 2,
  "category": "commercial",
  "role": "Designer/3D Visualiser/Render",
  "overview": "Full project description...",
  "tags": ["sketchup", "blender"],
  "project_images": [
    {
      "id": 1,
      "filename": "1.png",
      "display_order": 0,
      "is_cover": true
    }
  ]
}
Getting Started
Requirements
Node.js 20+

PostgreSQL 18 running locally

Project images on disk at PORTFOLIO_DIR

Install
bash
npm install
Environment
Create .env:

text
DATABASE_URL=postgresql://dbadmin@localhost/portfolio
PORTFOLIO_DIR=/var/lib/pgsql/portfolio
PORT=3001
Generate Prisma Client
bash
npx prisma generate
Dev Server
bash
npm run dev
# → http://localhost:3001
Build & Deploy
bash
# Compile TypeScript
npm run build

# Restart systemd service
sudo systemctl restart web-portfolio-api

# Check status
sudo systemctl status web-portfolio-api
Every source change requires a rebuild before restarting the service —
the service runs dist/index.js, not the TypeScript source.

Systemd Service
Located at /etc/systemd/system/web-portfolio-api.service.
Starts automatically on boot, runs as user dufok.

bash
sudo systemctl enable web-portfolio-api   # enable on boot
sudo systemctl start web-portfolio-api    # start
sudo systemctl restart web-portfolio-api  # restart after build
sudo journalctl -u web-portfolio-api -f   # live logs
Important Notes
BigInt Serialization
The folder_mtime field in the DB is BigInt. Node.js cannot serialize
BigInt to JSON natively. Fixed in src/index.ts:

typescript
(BigInt.prototype as any).toJSON = function () {
  return this.toString()
}
This must stay at the top of index.ts before any imports.

CORS
Whitelist is in src/app.ts. Add new origins there when deploying
to a public domain.

Image Storage
Images are read from PORTFOLIO_DIR at runtime — they are not
stored in the database or this repo. Directory structure:

text
/var/lib/pgsql/portfolio/
  02-2026-Roche-Stand/
    1.png
    2.png
    ...
  01-2020-LabMusicShow/
    1.png
    ...
