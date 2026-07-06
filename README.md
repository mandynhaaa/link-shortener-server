# 🚨 IMPORTANT: MONOREPO SUB-DIRECTORY

> 💡 **Looking for the main project repository?** This directory is just the backend layer of a decoupled workspace. All global configurations, prerequisites, full installation guides, and execution scripts are centralized in the **[Main Repository Root](../README.md)**.

---
# Brev.ly API - Backend

The core HTTP engine for the Brev.ly link shortener, engineered for high performance, structural integrity, and strict input runtime validation.

## 🚀 Tech Stack & Core Concepts

- **Runtime:** Node.js & TypeScript
- **HTTP Framework:** [Fastify](https://fastify.dev/) (Low overhead and highly extensible)
- **Database Layer:** PostgreSQL managed with [Drizzle ORM](https://orm.drizzle.team/)
- **Validation:** [Zod](https://zod.dev/) for structural request parsing and type-safety guarantees
- **Core Principles:** Focus on clean querying, resilient handling of operational edge-cases, and strict validation alignment.

## 🛣️ API Endpoints

All static and query-specific endpoints are declared before wildcards to ensure precise routing matching without conflicts.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/create-link` | Validates original and slug formats using rigorous Regex constraints. Saves a new record. |
| `GET` | `/list-links` | Retrieves paginated records of shortened links. |
| `POST` | `/export` | Aggregates analytical link performance and generates a download link for CSV format. |
| `DELETE`| `/:id` | Cascades deletion of a shortened link by database ID. |
| `GET` | `/:code` | (Wildcard Router) Increments unique clicks securely, handles browser metadata hooks, and acts as the redirection controller. |

## 🧪 Database Setup

### Migrations
To keep the database schema structurally versioned and up to date, run:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```