# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Open EA Modeler is a git-native enterprise architecture modeling tool with a modern web UI. Models are stored as human-readable, diffable JSON files—not in a proprietary database.

**Primary notation**: ArchiMate 3.2 (MVP)
**Secondary notation**: BPMN 2.0 (Phase 2)
**Future**: UML, C4, custom notations

## Core Principles

1. **Git is the backend** — Models are JSON files in a repo, no database
2. **Modeling, not drawing** — Elements exist in a repository; diagrams are views of those elements
3. **Notation-agnostic core** — Multiple notations via pluggable metamodels
4. **80/20 rule** — Implement the 20% of each notation covering 80% of real use

## Architecture

```
Web UI (React + React Flow)
    ↓
Model Layer (TypeScript)
  - Element Repository (all elements)
  - Diagram Manager (views of model)
  - Relationship Tracker (valid connections)
    ↓
Metamodel Engine
  - Notation Plugins (ArchiMate, BPMN, etc.)
  - Validation Rules
  - Constraint Checker
    ↓
Persistence Layer
  - JSON files (elements/, relationships/, views/)
  - Import/Export (ArchiMate OEF, SVG, PNG)
  - Git integration
```

## Technology Stack

- **Canvas**: React Flow
- **UI**: React + TypeScript
- **State**: Zustand
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **File Storage**: Local FS + isomorphic-git
- **Desktop** (optional): Tauri

## Commands

```bash
# Development (once scaffolded)
pnpm install              # Install dependencies
pnpm dev                  # Start development server
pnpm build                # Build for production
pnpm test                 # Run tests
pnpm lint                 # Run ESLint
pnpm format               # Run Prettier
```

## Code Style

- **TypeScript**: Strict mode, explicit return types on exported functions
- **Formatting**: Prettier (2-space indent, single quotes, 80-char lines)
- **Validation**: Zod schemas for all data structures (elements, relationships, views)
- **Testing**: Vitest for unit tests, Playwright for E2E

## Commit Messages

Use the `commit-message` skill for conventional commits:

```bash
# Trigger with: "create commit message" or "ready to commit"
```

Format: `type(scope): subject`

Scopes: `metamodel`, `canvas`, `ui`, `model`, `persistence`, `archimate`, `bpmn`, `git`

See `.claude/skills/commit-message/README.md` for details.

## Model File Structure

```
/project-root
├── .openea/
│   ├── config.json         # Project settings
│   └── styles.json         # Custom colors, fonts
├── elements/
│   ├── business/           # actors.json, processes.json, services.json
│   ├── application/        # components.json, services.json, data-objects.json
│   └── technology/         # nodes.json, infrastructure.json, artifacts.json
├── relationships/
│   └── relationships.json
└── views/
    └── *.view.json
```

## Key Data Structures

- **Element**: `{ id, type: "archimate:*", name, documentation, properties, tags }`
- **Relationship**: `{ id, type: "archimate:*", sourceId, targetId, ... }`
- **View/Diagram**: `{ id, name, viewpoint, nodes[], edges[], groups[] }`

Nodes reference elements by `elementId`; edges reference relationships by `relationshipId`.

## ArchiMate MVP Scope

- **Business Layer**: Actor, Role, Process, Function, Event, Service, Object
- **Application Layer**: Component, Interface, Service, Data Object
- **Technology Layer**: Node, Device, System Software, Interface, Network, Service, Artifact
- **Relationships**: Composition, Aggregation, Assignment, Realization, Serving, Access, Triggering, Flow, Specialization, Association
- **Viewpoints**: Organization, Application Cooperation, Application Usage, Layered, Technology, Technology Usage, Business Process Cooperation

## Key Patterns

- **Element IDs**: UUIDs with type prefix (e.g., `elem-uuid-1234`)
- **Relationship validation**: Check `validConnections` in metamodel before creating
- **Layer colors**: Business=#FFFFB5, Application=#B5FFFF, Technology=#C9E7B7
- **Diagram nodes**: Reference elements by ID, store position/size separately

## Technical Debt

Document workarounds in code with `// TODO:` comments and track significant items:

```bash
echo "TODO-001: [description]" >> TECH_DEBT.md
```
