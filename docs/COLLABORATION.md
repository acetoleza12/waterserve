# Collaborating on WaterServe

## Clone the project

The repository is intended to be private. The owner must add each groupmate through the repository's Settings > Collaborators and wait for the invitation to be accepted.

```powershell
git clone https://github.com/acetoleza12/waterserve.git
cd waterserve
npm ci
npm run setup
npm run dev
```

Each person creates their own administrator and maintenance accounts on their own local database. When setup asks whether to apply the migration, choose Yes. The local setup key is printed by the setup command and stored in .dev.vars.

## Make changes on a branch

Before starting a new task:

```powershell
git switch main
git pull --ff-only origin main
git switch -c feature/describe-your-change
```

After editing the source:

```powershell
npm run typecheck
npm run build
git status
git add app components hooks lib styles docs scripts
git commit -m "Describe the change"
git push -u origin feature/describe-your-change
```

Stage only the folders or files you changed. Replace the branch name and commit message with names appropriate to your task. Open a pull request on GitHub, ask a groupmate to review it, and merge after review. Other groupmates can then pull the updated main branch.

## What GitHub shares

The repository shares source code, package-lock.json, and SQL migration files. It does not share records, uploaded incident photos, staff accounts, passwords, sessions, or setup keys. Those remain in each person's .wrangler directory and .dev.vars file.

Cloning creates a copy of the source code. It does not connect two local databases. A shared deployed server/database is needed if the group wants to see the same live incident records.

## Existing working copy

Keep your current .wrangler directory and .dev.vars file. Do not delete them when replacing source files. Do not upload them or post screenshots of their contents in repository issues or pull requests.

## Database schema changes

Commit generated SQL migrations together with the matching schema changes. Do not edit migration files that have already been applied by another groupmate. Coordinate schema changes before merging.
