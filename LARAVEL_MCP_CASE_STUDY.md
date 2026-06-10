# Case Study: AI-Assisted Development with Laravel MCP & Claude Code on Cofounderly

> Date: May 2026 | Project: Cofounderly | Author: naufel26

---

## Overview

Cofounderly is a professional networking SPA for Bangladesh's startup ecosystem — think LinkedIn, but focused on founders, investors, and early-stage teams. The app was built entirely with **Claude Code** (Anthropic's CLI for Claude) as the primary development assistant, wired directly into the Laravel codebase via the **Model Context Protocol (MCP)**.

This case study documents the exact setup, the tools used, and how the Claude + Laravel MCP integration changed the development workflow in practice.

---

## The Problem with Vanilla AI Coding Assistants

Standard AI coding assistants operate with a fundamental limitation: they only know what's in their training data or what you paste into the prompt. When you're working in a real production codebase, this means:

- The AI doesn't know your database schema, so it guesses column names.
- It doesn't know your route structure, so it writes `url('/foo')` instead of `route('foo.index')`.
- It can't run a query to check what's actually in the database.
- It generates code for the wrong package version.
- It can't read your browser's console errors.

**MCP solves this.** Instead of the AI working from static context, it can call live tools against your running application. Laravel MCP makes this possible directly from Artisan.

---

## Tech Stack

### Backend

| Package | Version | Role |
|---|---|---|
| PHP | 8.4.20 | Runtime |
| Laravel Framework | 12.51.0 | Application framework |
| `inertiajs/inertia-laravel` | v2 | Server-side Inertia adapter |
| `laravel/fortify` | v1.30 | Headless authentication backend |
| `laravel/reverb` | v1.10 | First-party WebSocket server |
| `laravel/wayfinder` | v0.1.9 | Generates TypeScript route functions |
| `laravel/mcp` | v0 | MCP server protocol implementation |
| `laravel/boost` | v2 | AI-aware MCP toolset for Laravel |
| `spatie/laravel-permission` | v7.2 | Role-based access control |
| `laravel/pint` | v1.24 | PHP code formatter |
| `pestphp/pest` | v4.3 | Test framework |
| `phpunit/phpunit` | v12 | Underlying test runner |

### Frontend

| Package | Version | Role |
|---|---|---|
| React | v19 | UI library |
| `@inertiajs/react` | v2.3.7 | Inertia React adapter |
| TypeScript | v5.7.2 | Type safety |
| Tailwind CSS | v4 | Utility-first CSS |
| Vite | v7 | Build tool |
| `@laravel/vite-plugin-wayfinder` | v0.1.3 | Auto-generates typed route functions |
| `laravel-echo` | v2.3.4 | WebSocket client |
| `@tanstack/react-query` | v5.90 | Server state management |
| `framer-motion` | v12 | Animations |
| `@radix-ui/*` | various | Accessible UI primitives |
| `sonner` | v2 | Toast notifications |

### AI Tooling

| Tool | Version | Role |
|---|---|---|
| Claude Code (CLI) | latest | Primary development assistant |
| Claude Sonnet 4.6 | `claude-sonnet-4-6` | Model powering the assistant |
| `laravel/mcp` | v0 | MCP protocol layer (JSON-RPC over stdio) |
| `laravel/boost` | v2 | MCP toolset exposed to Claude |

---

## How the Integration Works

### The MCP Protocol

MCP (Model Context Protocol) is an open standard that allows AI models to call external tools via a structured interface. In this project, Laravel acts as an MCP **server**, and Claude Code acts as the MCP **client**.

The flow is:

```
Claude Code (client)
    ↓ JSON-RPC over stdio
Laravel Artisan process (server)
    ↓ php artisan boost:mcp
Laravel Boost MCP Server
    ↓ dispatches to tool handlers
Database / Logs / Tinker / Routes / Docs API
```

### Configuration

The entire integration requires two files:

**`.mcp.json`** — tells Claude Code how to start the MCP server:

```json
{
    "mcpServers": {
        "laravel-boost": {
            "command": "php",
            "args": ["artisan", "boost:mcp"]
        }
    }
}
```

**`.claude/settings.local.json`** — pre-authorizes specific MCP tools so Claude doesn't prompt for confirmation on every call:

```json
{
  "permissions": {
    "allow": [
      "Bash(php artisan *)",
      "Bash(vendor/bin/pint *)",
      "Bash(npm run *)",
      "mcp__laravel-boost__get-absolute-url",
      "mcp__laravel-boost__browser-logs",
      "mcp__laravel-boost__last-error",
      "mcp__laravel-boost__read-log-entries",
      "mcp__laravel-boost__list-routes"
    ]
  },
  "enableAllProjectMcpServers": true,
  "enabledMcpjsonServers": ["laravel-boost"]
}
```

When Claude Code starts in the project directory, it reads `.mcp.json`, spawns `php artisan boost:mcp` as a subprocess, and maintains a persistent JSON-RPC connection over stdin/stdout. All MCP tool calls flow through this channel with no HTTP overhead.

### The CLAUDE.md File

A `CLAUDE.md` file at the project root provides Claude with project-level instructions loaded automatically into every session. For this project it contains:

- Exact package versions so Claude never targets the wrong API.
- Instructions to use MCP tools before guessing (e.g. "use `search-docs` before making code changes").
- Domain-specific **skills** that activate automatically based on what task is in progress (e.g. `tailwindcss-development`, `pest-testing`, `inertia-react-development`).
- Code conventions: constructor property promotion, explicit return types, PHPDoc over inline comments.
- Project structure rules: don't create new base folders, don't change dependencies without approval.

This means every Claude Code session starts with full project context rather than a blank slate.

---

## Laravel Boost: The MCP Toolset

`laravel/boost` is the package that registers MCP tools against the running Laravel application. It sits on top of `laravel/mcp` and exposes 16 tools to Claude:

| Tool | What Claude uses it for |
|---|---|
| `application-info` | Read app name, environment, installed packages with versions |
| `database-schema` | Inspect table structure before writing migrations or Eloquent queries |
| `database-query` | Run read-only SQL queries to verify data or debug state |
| `database-connections` | Check connection config |
| `tinker` | Execute arbitrary PHP in the app context (like `artisan tinker`) |
| `read-log-entries` | Read Laravel log entries to diagnose errors |
| `last-error` | Get the most recent exception from the log |
| `browser-logs` | Read browser console errors and exceptions in real time |
| `list-routes` | List all registered routes with methods, names, and middleware |
| `list-artisan-commands` | Discover available Artisan commands before running them |
| `list-available-config-keys` | Browse the config tree |
| `list-available-env-vars` | See available environment variables |
| `get-config` | Read specific config values |
| `get-absolute-url` | Resolve the correct scheme/host/port for a named route |
| `search-docs` | Search version-specific Laravel ecosystem documentation |

The `search-docs` tool is particularly powerful: it calls a remote Boost API (`boost.laravel.com`) with the project's installed package list, so results are filtered to this project's exact versions of Laravel, Inertia, Pest, Tailwind, etc. Claude is instructed to call this tool before writing any code that touches the Laravel ecosystem.

---

## Development Workflow in Practice

### 1. Schema-Aware Code Generation

Before writing a migration or an Eloquent query, Claude calls `database-schema` to inspect the actual table. This eliminates guessed column names and type mismatches.

**Example prompt:** *"Add a `is_featured` boolean to posts."*

Claude's actual steps:
1. Calls `mcp__laravel-boost__database-schema` → reads the `posts` table definition.
2. Sees existing columns, their types, nullability, and defaults.
3. Generates the migration with the correct `after()` placement and correct existing column attributes (required in Laravel 12 when modifying columns).
4. Runs `php artisan make:migration` via Bash, writes the content, runs `php artisan migrate`.

### 2. Live Debugging Without Context-Switching

When a page throws a 500, the typical workflow is: open logs, copy the error, paste it into a chat. With MCP, Claude calls `mcp__laravel-boost__last-error` directly and gets the full stack trace, then calls `mcp__laravel-boost__browser-logs` to cross-reference the browser-side error. No copy-pasting.

**Example:** During the real-time chat feature, an Inertia page was silently failing to hydrate. Claude called `browser-logs`, saw a `TypeError: Cannot read properties of undefined (reading 'map')` in the React component, traced it back to a missing `conversations` prop in the `HandleInertiaRequests` middleware, and fixed it — without the developer reproducing the error manually.

### 3. Route-Aware Frontend Development (Wayfinder)

`laravel/wayfinder` generates TypeScript functions from the Laravel route list. Claude calls `list-routes` to verify the exact route name and parameters exist before generating Wayfinder imports in React components. This prevents importing phantom routes that haven't been registered.

```typescript
// Wayfinder-generated, Claude verifies the route exists first:
import { show } from '@/actions/ProfileController';

router.visit(show({ username: user.username }));
```

### 4. Documentation-Driven Code

Claude is instructed to call `search-docs` before making any changes that involve framework behavior. This is enforced by the `CLAUDE.md` file:

> "Search the documentation before making code changes to ensure we are taking the correct approach."

For example, when implementing Inertia v2's deferred props for the notification feed, Claude searched `["deferred props", "WhenVisible inertia"]` against the Boost docs API, got version-specific Inertia v2 documentation, and generated the correct `<Deferred>` + skeleton pattern rather than the v1 `Lazy::create()` approach.

### 5. Automated Code Formatting

After every code change, Claude runs `vendor/bin/pint --dirty --format agent` to enforce PSR-12 formatting. This is mandated in `CLAUDE.md` and runs automatically before Claude finalizes any PHP changes.

### 6. Test-Driven Verification

The project enforces that every change has a test. Claude writes Pest feature tests, runs `php artisan test --compact --filter=TestName` to verify, then reports results. The MCP tools are used here too: `tinker` can verify model factory state, `database-query` can check seeded data.

---

## Skill System

Claude Code supports a **skills** system — domain-specific instruction sets that activate based on the task context. The project uses five skills wired in `CLAUDE.md`:

| Skill | Activates when... |
|---|---|
| `wayfinder-development` | Referencing backend routes in frontend components |
| `inertia-react-development` | Working with React pages, forms, navigation, or Inertia v2 features |
| `tailwindcss-development` | Adding or modifying CSS, layout, colors, or responsive behavior |
| `pest-testing` | Writing or running tests |
| `developing-with-fortify` | Touching auth: login, registration, 2FA, password reset |

Skills load additional version-specific instructions that override generic behavior. For example, the `tailwindcss-development` skill loads Tailwind v4 utilities (which have different syntax from v3), preventing Claude from generating `@apply` directives or outdated config-based color tokens.

---

## Key Benefits Observed

**Eliminated version confusion.** Claude never generated Laravel 10 syntax in a Laravel 12 project. The combination of `CLAUDE.md` version pinning and `search-docs` returning version-specific docs was the fix.

**Zero schema guessing.** With `database-schema` always available, generated migrations and Eloquent queries matched the actual database on the first attempt.

**Faster debugging cycle.** `last-error` + `browser-logs` meant errors were diagnosed in the same turn they were reported. No back-and-forth copying stack traces.

**Consistent code style.** Pint running after every change meant PRs had no style noise — every diff was semantic.

**Living documentation context.** `CLAUDE.md` acts as a persistent project brief. Every new Claude Code session starts with full knowledge of conventions, package versions, and architectural rules without re-explaining them.

---

## Project Structure Relevant to MCP

```
cofounderly/
├── .mcp.json                     # MCP server config — points to boost:mcp
├── .claude/
│   └── settings.local.json       # Pre-authorized MCP tool permissions
├── CLAUDE.md                     # Project instructions injected into every session
├── composer.json                 # Includes laravel/boost and laravel/mcp (dev)
├── vendor/
│   ├── laravel/mcp/              # MCP protocol layer (JSON-RPC, Tool/Resource/Prompt primitives)
│   └── laravel/boost/            # 16 MCP tools exposed to Claude
```

`laravel/boost` is a `require-dev` dependency — it's never loaded in production. The `boost:mcp` Artisan command is only available in development environments, and the `BoostServiceProvider` checks for this before registering anything.

---

## Limitations & Considerations

**Only runs in dev.** The MCP server is a dev-only tool. It has no production surface area.

**Tinker is powerful — and dangerous.** The `tinker` tool can execute arbitrary PHP. The project's `CLAUDE.md` instructs Claude not to create or mutate models via tinker without explicit user approval, using it only for read/debug operations.

**`search-docs` requires internet.** The documentation search calls the `boost.laravel.com` API. Offline development loses this capability, falling back to training data (which is why it's a guideline to search first, not a hard gate).

**Permissions need upfront configuration.** Without pre-authorizing tools in `settings.local.json`, Claude prompts for approval on every MCP call, which breaks the flow. The pre-authorization list needs to be kept in sync as new tools are used.

---

## Summary

The Laravel MCP + Claude Code integration on Cofounderly represents a meaningful shift from "AI as autocomplete" to "AI as a context-aware development partner." The key insight is that AI coding assistants are most useful when they can read the actual state of the system — the schema, the logs, the routes, the browser console — rather than guessing from static context.

`laravel/mcp` provides the protocol. `laravel/boost` provides the tools. `CLAUDE.md` provides the project knowledge. Together, they give Claude enough context to write production-quality Laravel code on the first attempt, debug real errors without developer handholding, and stay consistent with the project's conventions across every session.

---

*Built with Laravel 12.51.0, PHP 8.4.20, Claude Sonnet 4.6, and laravel/boost v2.*
