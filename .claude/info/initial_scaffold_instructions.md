# EAFlow - Initial Project Scaffold

## Context
EAFlow is a modern, git-native enterprise architecture modeling tool. We're building a Sparx EA alternative that architects actually want to use—pleasant UX, ArchiMate/BPMN support, JSON files in git (not a proprietary database).

## Existing Documentation
Read `docs/architecture/overview.md` first—it contains the full architecture vision, data structures, metamodel definitions, technology choices, and phased roadmap.

## Task: Scaffold the Monorepo

Create the initial project structure with working builds:

### 1. Root Configuration
- pnpm workspace (pnpm-workspaces.yaml)
- Root package.json with workspace scripts
- TypeScript base config (tsconfig.base.json)
- .gitignore (Node, TypeScript, IDE files, build artifacts)
- LICENSE (MIT)
- README.md (project vision, setup instructions, tech stack, contributing)

### 2. Packages to Create

**packages/core/**
- TypeScript types for ArchiMate elements, relationships, views
- Zod schemas for runtime validation
- Element repository (CRUD operations, in-memory + JSON persistence)
- Relationship repository with validation
- Basic metamodel loader

**packages/notations/archimate/**
- ArchiMate 3.2 metamodel definition (JSON)
- MVP element types: Business (Actor, Role, Process, Function, Event, Service, Object), Application (Component, Interface, Service, DataObject), Technology (Node, Device, SystemSoftware, Interface, Network, Service, Artifact)
- MVP relationship types: Composition, Aggregation, Assignment, Realization, Serving, Access, Triggering, Flow, Specialization, Association
- TypeScript types specific to ArchiMate

**packages/ui/**
- Vite + React + TypeScript setup
- Tailwind CSS configured
- React Flow installed and rendering empty canvas
- Basic app shell with placeholder panels (Palette, Canvas, Properties, Browser)
- Zustand store scaffolded

### 3. Quality Setup
- ESLint + Prettier configured
- TypeScript strict mode
- Package scripts: dev, build, lint, typecheck

### 4. Verification
After scaffolding, the following should work:
- `pnpm install` completes
- `pnpm build` compiles all packages
- `pnpm dev` starts the UI with an empty React Flow canvas
- `pnpm lint` passes
- `pnpm typecheck` passes

## Constraints
- Use pnpm workspaces
- React Flow for canvas
- Zustand for state management  
- Zod for schema validation
- Keep it minimal—just enough to have a working foundation
- No Archi import yet, no BPMN yet—just ArchiMate core

## Output
Working monorepo that builds and runs, showing a React Flow canvas. We'll iterate from there to add drag-drop, property editing, and persistence.