# EAFlow

A modern, git-native enterprise architecture modeling tool. Models are stored as human-readable, diffable JSON files—not in a proprietary database.

## Why EAFlow?

- **Git is the backend** — Models live in your repo. Branch, merge, PR review your architecture.
- **Modeling, not drawing** — Elements exist in a repository; diagrams are views of those elements.
- **ArchiMate 3.2** — Full support for the industry-standard EA notation.
- **Modern UX** — A tool architects actually want to use.

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build all packages
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm typecheck
```

## Project Structure

```
packages/
├── core/                    # Core modeling engine
│   ├── src/
│   │   ├── types/          # TypeScript type definitions
│   │   ├── schemas/        # Zod validation schemas
│   │   ├── repository/     # Element & relationship CRUD
│   │   └── metamodel/      # Metamodel loader
│   └── package.json
│
├── notations/
│   └── archimate/          # ArchiMate 3.2 notation
│       ├── src/
│       │   ├── metamodel.json
│       │   └── types.ts
│       └── package.json
│
└── ui/                      # React web application
    ├── src/
    │   ├── components/     # UI components
    │   ├── store/          # Zustand state management
    │   └── App.tsx
    └── package.json
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Canvas | React Flow |
| UI | React + TypeScript |
| State | Zustand |
| Styling | Tailwind CSS |
| Validation | Zod |
| Build | Vite |

## Model File Structure

When you create an architecture project, files are organized like this:

```
my-architecture/
├── .openea/
│   └── config.json         # Project settings
├── elements/
│   ├── business/           # Business layer elements
│   ├── application/        # Application layer elements
│   └── technology/         # Technology layer elements
├── relationships/
│   └── relationships.json  # All relationships
└── views/
    └── *.view.json         # Diagram definitions
```

## ArchiMate Support (MVP)

**Elements:**
- Business: Actor, Role, Process, Function, Event, Service, Object
- Application: Component, Interface, Service, Data Object
- Technology: Node, Device, System Software, Interface, Network, Service, Artifact

**Relationships:**
- Structural: Composition, Aggregation, Assignment, Realization
- Dependency: Serving, Access
- Dynamic: Triggering, Flow
- Other: Specialization, Association

## Contributing

Contributions are welcome! Please read the architecture documentation in `docs/architecture/` before starting.

## License

MIT License - see [LICENSE](LICENSE) for details.
