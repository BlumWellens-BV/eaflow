# Commit Message Skill

**Version**: 1.1.0
**Status**: Stable

## Project

**GitHub Repository**: https://github.com/BlumWellens-BV/eaflow

## Overview

Generates well-structured conventional commit messages for EAFlow. Follows the conventional commits specification with project-specific conventions, including milestone references and time tracking.

## Usage

Trigger phrases:
- "Create commit message"
- "Ready to commit"
- "Format commit"

### Example

```
User: "Create commit message for my changes"

Claude: Analyzing git status and diff...

Generated commit message:

feat(metamodel): add ArchiMate business layer element types

Add Business Actor, Role, Process, Function, Event, Service, and Object
element type definitions to the ArchiMate metamodel with Zod validation.

- Define TypeScript types for business layer elements
- Add Zod schemas for runtime validation
- Include layer coloring (yellow for business layer)
- Document element relationships and constraints

Closes #42

Accept and commit? (yes/edit/cancel)
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature or capability |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Code style/formatting |
| `refactor` | Code restructuring |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance, deps, config |
| `ci` | CI/CD changes |
| `build` | Build system changes |

### Scopes

| Scope | Description |
|-------|-------------|
| `metamodel` | Metamodel engine, notation plugins |
| `canvas` | React Flow canvas, diagram rendering |
| `ui` | UI components, panels, palettes |
| `model` | Element/relationship/diagram management |
| `persistence` | File I/O, JSON format, import/export |
| `archimate` | ArchiMate-specific code |
| `bpmn` | BPMN-specific code |
| `git` | Git integration features |

### Subject Line Rules

- Imperative mood ("add" not "added")
- No period at end
- Max 72 characters
- Lowercase after type/scope

### Body

- Explain what and why (not how)
- Wrap at 72 characters
- Bullet points for multiple changes

### Footer

- `Closes #123` - Closes an issue
- `Fixes #123` - Fixes a bug issue
- `Milestone: 0.2 - Basic Modeling` - Associates with milestone
- `Time-spent: 2h` - Tracks effort (Xm, Xh, Xd)
- `BREAKING CHANGE:` - Documents breaking changes

## Workflow

1. **Analyze changes**: Read git status/diff
2. **Determine type**: Based on nature of changes
3. **Identify scope**: From modified files
4. **Draft subject**: Concise description
5. **Write body**: Explain changes
6. **Add footer**: Issue references
7. **Review**: Present for approval
8. **Commit**: Create the commit

## Related

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Project Architecture](../../docs/architecture/overview.md)
