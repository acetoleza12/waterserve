# WaterServe code guide

## Start here

`app/page.tsx` is the application shell. It selects the appropriate screen and places the header, footer, messages, and incident dialog around it. It does not contain the full markup for every screen.

`hooks/useWaterServe.ts` coordinates navigation, form actions, session state, report polling, and browser-saved tracking codes. View components receive only the fields and actions they use through typed props.

## Folder map

| Location | Responsibility |
| --- | --- |
| `app/page.tsx` | Application shell and screen selection |
| `app/layout.tsx` | Document layout and page metadata |
| `app/api/[...path]/route.ts` | API routing, request parsing, and common error responses |
| `components/resident/` | Home, reporting, tracking, saved reports, and notifications |
| `components/auth/` | Staff login and first administrator setup screens |
| `components/staff/` | Dashboard, incident list, customer directory, staff management, and account settings |
| `components/incidents/` | Reusable incident table and incident details dialog |
| `components/layout/` | Site header and footer |
| `components/shared/` | Status badge, empty-state message, and photo input |
| `hooks/useWaterServe.ts` | State and application actions used by the screens |
| `lib/api-client.ts` | Browser HTTP requests and server error messages |
| `lib/constants.ts` | Issue types, report statuses, and date formatting |
| `lib/types.ts` | Staff, incident, history, and tracking data definitions |
| `lib/export-incidents.ts` | CSV download formatting |
| `lib/server/authentication.ts` | Setup, sign-in, sign-out, session information, and password changes |
| `lib/server/incidents.ts` | Submission, public tracking, report lists, and workflow updates |
| `lib/server/staff.ts` | Staff listing and account creation |
| `lib/server/images.ts` | Authorized access to uploaded photos |
| `lib/server/helpers.ts` | Validation, response formatting, password hashing, sessions, limits, and photo storage |
| `lib/server/request-context.ts` | Shared values passed from the router to a feature handler |
| `styles/` | Styles grouped by screen purpose and responsive breakpoints |
| `db/` | Database schema and connection helper |
| `drizzle/` | Existing SQL migration and migration metadata |
| `scripts/` | Local setup, environment configuration, and development/build commands |
| `worker/` | Server entry point |
| `public/` | Static assets |

## Follow a resident report through the code

1. `ReportIssuePage` renders the form.
2. `submitReport` in `useWaterServe` gathers the form values and calls `apiRequest`.
3. The API route selects `submitIncident` in `lib/server/incidents.ts`.
4. The handler validates the input, stores the record and optional photo, and returns the tracking code.
5. The controller remembers the code on this browser and displays `ReportConfirmationPage`.
6. `TrackReportPage` displays the public status and history returned by the tracking endpoint.

Staff updates use the same path through the controller and API router. The server checks roles and assignments; hiding a button is not treated as authorization.

## Where to make common changes

- Change a screen's wording or layout: edit that screen under `components/`.
- Change status colors: edit `styles/resident.css`, where badge styles are defined.
- Change the mobile layout: edit `styles/responsive.css`.
- Change CSV columns: edit `lib/export-incidents.ts`.
- Change an action or navigation behavior: edit `hooks/useWaterServe.ts`.
- Change a server operation: edit the matching file under `lib/server/`.
- Change issue types: keep `lib/constants.ts` and submission validation in `lib/server/incidents.ts` consistent.

## Use this update with your working project

Stop the development server before copying the updated source files into your existing project folder. Keep your existing `.wrangler/` directory and `.dev.vars` file: they contain the local records, uploads, and setup configuration. The source ZIP does not contain or replace these files.

If dependencies are already installed, run `npm run dev` after copying the source. There is no need to run setup again for this organization update.

## Code checks

```sh
npm run typecheck
npm run build
```

These commands check source types and compilation. They do not run database workflow tests or migrations.

Formatting uses two spaces, semicolons, and double quotes. `.prettierrc.json` and `.prettierignore` document the formatting rules and excluded generated files.
