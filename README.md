# Crafts Inventory

A web application that simplifies inventory management for a group of artisans.

**[Live demo](https://crafts-inventory.netlify.app/)** · **[Source code](https://github.com/franciscovenes/crafts-inventory)**

**Demo account (admin access, so you can try every feature):**

```text
email:    guest-admin@test.pt
password: &fVmK7QpZe7WQTjSHKaj
```

The demo limits the number of items and master data rows, so please be considerate.

> **Status: in progress.** The core inventory features work. See the [roadmap](#roadmap) for what comes next.

## Features

- Browse inventory items in a table or as cards, with pagination
- Search items with a structured search bar (backed by a PostgreSQL function, see [Search](#search))
- Create and update items
- Manage master data: add rows to existing categories (models, types, states, conditions and artisans) and activate or deactivate them
- Authentication with role-based access in the interface
- Light and dark logo and favicon, and an organisation logo that can be changed

## Tech stack

| Area                | Tools                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Frontend            | React 19, React Router 7, Vite, CSS Modules, Lucide icons, JetBrains Mono (via Fontsource) |
| Validation          | Zod                                                                                        |
| Backend             | Supabase: PostgreSQL, Authentication, Row Level Security, SQL functions                    |
| Database migrations | Supabase CLI                                                                               |
| Tooling             | pnpm, ESLint                                                                               |
| Hosting             | Netlify (frontend) and Supabase (backend)                                                  |

## How it works

### Data model

Each inventory item belongs to a model, a type, a state, a condition and an artisan, all stored in their own lookup tables. Items and colours have a many-to-many relationship through the `item_colors` join table. Lookup tables are what the "master data" screens manage.

### Authentication and authorisation

Login uses Supabase Authentication. A `profiles` table decides what each user can see and do in the interface, and Row Level Security is enabled on every table, so access to the data is enforced by the database and not only by the frontend.

### Search

The inventory search is implemented as a PostgreSQL function (`search_items`) that works with a searchable document built for each item and a filter evaluation function.

The search feature combines autocomplete suggestions, structured filters, and keyword-based relevance ranking to help users find inventory items efficiently. Users can search by model, type, condition, state, color, price, dimensions, production hours, and location, combining multiple criteria in a single query.

Numeric filters support comparison operators such as `>`, `<=`, and `=`. Search queries are serialized into URL parameters, allowing searches to persist across navigation and be shared via links.

PostgreSQL applies hard filters and ranks matching items by keyword relevance, giving additional weight to matches where keywords appear together as phrases in master-data fields.

### Security

- Row Level Security is enabled on every table, and only users with an active profile can read data.
- The browser cannot write to the tables directly. All writes go through PostgreSQL functions that check the caller's profile (and the admin role for master data changes), validate the master data category against a fixed list, and enforce limits on the number of items and master data rows.
- Execution of these functions is revoked from `PUBLIC` and `anon` and granted only to `authenticated`.

### Project structure

```text
src/
  app/          router, providers and route guards
  components/   shared UI components
  features/     auth, inventory and master-data (components, services, validation)
  layouts/      page and dashboard layouts
  lib/          Supabase client
  pages/        route-level pages
  styles/       global styles and variables
supabase/
  migrations/   schema, RLS policies, SQL functions, triggers
  seed.sql      sample data
```

## Getting started

### Requirements

- Node.js and [pnpm](https://pnpm.io/)
- A [Supabase](https://supabase.com/) project (or the Supabase CLI with Docker for a local instance)

### Install and run

```bash
pnpm install
pnpm dev
```

### Environment variables

Create a `.env.local` file in the project root:

```text
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The publishable key is meant to be used in the browser. Your data is protected by the Row Level Security policies, so do not disable them.

### Set up the database

The schema, policies and functions are in `supabase/migrations`. With the Supabase CLI, link your project and push the migrations:

```bash
pnpm supabase link --project-ref <your-project-ref>
pnpm supabase db push
```

`supabase/seed.sql` contains sample data for development.

### Other scripts

```bash
pnpm build   # production build in dist/
pnpm start   # preview the production build locally
pnpm lint    # run ESLint
```

## Deployment

The frontend is deployed on Netlify. A `_redirects` file sends every route to `index.html`, so direct links to inner pages work in this single-page app.

## Design decisions

**Why Supabase?** I started with Supabase and a frontend on Netlify because it was the free option available while I was still arranging access to a server. If I were starting again I would begin with an Express API, but building on Supabase taught me a lot about PostgreSQL, Row Level Security and database functions, and the database design carries over to the next version.

## Roadmap

- Let admins add and remove master data categories and item properties
- Basic statistics for admins
- Replace Supabase with a Node.js and Express backend, hosted on my own Debian server with an automated deployment pipeline
- Migrate the project to TypeScript

## Known limitations

- Customisation is limited to the organisation logo. Admins cannot yet add or remove master data categories or item properties.

## License

Released under the [MIT License](LICENSE). You are free to use, copy, modify and distribute this code, as long as the copyright notice and the license text are kept.
