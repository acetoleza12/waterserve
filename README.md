# WaterServe

An online incident-reporting portal for Calbayog City water service concerns.

## Requirements
- Node.js 22.13 or newer
- A modern web browser

## Run locally for presentation
Open a terminal in this extracted project folder and run:

```sh
npm ci
npm run setup
npm run dev
```

Open the Local URL printed in the terminal (normally http://127.0.0.1:5173).

`npm run setup` creates a local database and prints your private setup key. The application and database run on your computer. Local records and uploaded images persist under `.wrangler/state` between restarts. No external database account is required for this presentation mode.

## Admin and maintenance login
1. Open **Staff portal > Set up administrator**.
2. Enter the setup key printed by `npm run setup` (also stored in your untracked `.dev.vars` file).
3. Choose a name, email address, and password of at least 12 characters.
4. Sign in with **Administrator** selected.
5. Open **Staff & access** to create maintenance personnel accounts.
6. Sign out, select **Maintenance**, and sign in with the credentials created for that worker.

There are no built-in default credentials. Administrator setup is disabled after the first account is created. Residents can report and track issues without an account.

## Features
- Incident submission with resident contact details and an optional JPG/PNG photo up to 5 MB
- Unique report tracking codes and timestamped status history
- Administrator dashboard, incident search and filters, assignments, customer directory, and CSV export
- Maintenance dashboard showing only assigned work, with start-work and resolution actions
- Repair notes and optional completion photos
- Staff password changes and server-side role authorization
- Responsive layout and in-portal notifications

Status flow: Submitted > Assigned > In Progress > Resolved.

Browser-local report shortcuts are stored separately from the shared incident database. Alerts appear inside the portal; email and SMS delivery are not configured. Customer records are self-reported and are not synchronized with official district records. Billing and payment processing are outside this project's scope.

## Build and validation
```sh
npm run typecheck
npm run build
npm start
```

The standalone application uses React, TypeScript, Vinext/Vite, and Cloudflare D1/R2-compatible storage. Staff authentication uses the application's own password and session endpoints.

## Optional independent hosting
For a live deployment to your own Cloudflare account:
1. Create a D1 database and an R2 bucket with the names in `wrangler.jsonc`.
2. Replace the example database_id with your actual D1 database ID.
3. Apply database migrations using `npx wrangler d1 migrations apply DB --remote`.
4. Configure a strong private setup key using `npx wrangler secret put SETUP_KEY --config dist/server/wrangler.json` after building.
5. Deploy using `npx wrangler deploy --config dist/server/wrangler.json`.

Hosting setup and costs depend on your provider. Never commit `.dev.vars`, database files, staff passwords, or uploaded customer data. Use appropriate backups and data-retention rules before operational use.


## Understanding and editing the code

The application is organized into focused screen components, a controller hook, client helpers, server feature handlers, and grouped stylesheets. See [docs/CODE-GUIDE.md](docs/CODE-GUIDE.md) for a folder map and a walkthrough of the report flow.

When copying this source update into an existing working project, keep your `.wrangler/` directory and `.dev.vars` file. No setup or migration is needed solely for this code organization update.

## Group collaboration

See [docs/COLLABORATION.md](docs/COLLABORATION.md) for clone commands, branch and pull-request steps, and an explanation of which data stays local.
