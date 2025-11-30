---
name: commit-message
description: >
  Generates conventional commit messages for the EAFlow project.
  Analyzes git status/diff to create well-structured commits with proper
  type, scope, subject, body, GitHub issue/milestone references, and time tracking.
  Trigger with: "create commit", "commit message", "ready to commit", "format commit".
version: 1.1.0
status: stable
created: 2025-11-29
updated: 2025-11-30
author: Claude
tags: [git, commit, workflow]
allowed-tools: [Read, Bash, Glob]
dependencies: []
---

# Commit Message

## Project Context

**GitHub Repository**: https://github.com/BlumWellens-BV/eaflow
**Labels**: https://github.com/BlumWellens-BV/eaflow/labels
**Milestones**: https://github.com/BlumWellens-BV/eaflow/milestones

### Active Milestones

| Milestone | Description |
|-----------|-------------|
| 0.1 - Foundation | Scaffold complete, empty canvas renders |
| 0.2 - Basic Modeling | Palette → canvas, property panel, save/load |
| 0.3 - ArchiMate MVP | All MVP elements, relationships, validation |
| 0.4 - Import | Archi .archimate file import |
| 1.0 - Usable | Polish, keyboard shortcuts, undo/redo |

### Label Taxonomy

**Type**: `type::feature`, `type::bug`, `type::chore`, `type::docs`, `type::spike`

**Priority**: `priority::critical`, `priority::high`, `priority::medium`, `priority::low`

**Component**: `component::core`, `component::archimate`, `component::ui-canvas`, `component::ui-panels`, `component::persistence`, `component::import-export`

**Layer**: `layer::business` (user-facing), `layer::application` (UI impl), `layer::technology` (infra)

**Status**: `status::blocked`, `status::needs-design`, `status::ready`

## Purpose

Generate well-structured conventional commit messages that:
- Follow the conventional commits specification
- Use project-appropriate scopes
- Include clear descriptions of changes
- Reference GitHub issues and milestones
- Track time spent on work

## When to Use

Activate when user wants to:
- Create a commit message for staged/unstaged changes
- Format a commit with proper structure
- Review what will be committed

**Trigger keywords**: commit message, create commit, format commit, ready to commit

## Instructions

### Phase 1: Analyze Changes

1. **Check git status**

   ```bash
   git status --short
   ```

2. **Get diff summary**

   ```bash
   # Staged changes
   git diff --staged --stat

   # If nothing staged, check unstaged
   git diff --stat
   ```

3. **Review actual changes** (for context)

   ```bash
   git diff --staged
   # or
   git diff
   ```

### Phase 2: Determine Commit Type

Based on the changes, select the appropriate type:

| Type | When to Use |
|------|-------------|
| `feat` | New feature, capability, or element type |
| `fix` | Bug fix, error correction |
| `docs` | Documentation only (README, CLAUDE.md, comments) |
| `style` | Code formatting, no logic change |
| `refactor` | Code restructuring, no behavior change |
| `perf` | Performance improvement |
| `test` | Adding or updating tests |
| `chore` | Dependencies, config, tooling |
| `ci` | CI/CD pipeline changes |
| `build` | Build system, bundling changes |

### Phase 3: Identify Scope

Determine scope from modified file paths:

| Path Pattern | Scope |
|--------------|-------|
| `src/metamodel/`, `src/plugins/` | `metamodel` |
| `src/canvas/`, React Flow code | `canvas` |
| `src/components/`, `src/panels/` | `ui` |
| `src/model/`, element/relationship code | `model` |
| `src/persistence/`, file I/O | `persistence` |
| ArchiMate-specific | `archimate` |
| BPMN-specific | `bpmn` |
| Git integration | `git` |
| Multiple areas | use most significant, or omit |

### Phase 4: Generate Message

**Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Subject line rules:**
- Imperative mood: "add" not "added" or "adds"
- Lowercase after colon
- No period at end
- Max 72 characters total

**Body:**
- Blank line after subject
- Explain what changed and why
- Wrap lines at 72 characters
- Use bullet points for multiple items

**Footer:**
- `Closes #123` for issues this resolves
- `Fixes #123` for bugs this fixes
- `Milestone: 0.2 - Basic Modeling` to associate with milestone
- `Time-spent: 2h` to track effort (use: Xm, Xh, or Xd)
- `BREAKING CHANGE: description` for breaking changes

### Phase 5: Present and Confirm

Show the generated message:

```
Generated commit message:

---
<type>(<scope>): <subject>

<body>

<footer>
---

Files to be committed:
- file1.ts
- file2.ts

Accept and commit? (yes / edit / cancel)
```

If user says **yes**:
```bash
git add -A  # if needed
git commit -m "$(cat <<'EOF'
<full commit message>
EOF
)"
```

If user says **edit**: Ask what to change.

If user says **cancel**: Abort without committing.

## Examples

### Example 1: New Feature

```
feat(metamodel): add ArchiMate relationship type definitions

Define the 10 MVP relationship types for ArchiMate 3.2:
- Structural: Composition, Aggregation, Assignment, Realization
- Dependency: Serving, Access
- Dynamic: Triggering, Flow
- Other: Specialization, Association

Each relationship includes line style, arrow types, and valid
connection rules per the ArchiMate specification.

Milestone: 0.3 - ArchiMate MVP
Time-spent: 3h
Closes #15
```

### Example 2: Bug Fix

```
fix(canvas): correct node positioning after drag

Nodes were snapping to incorrect grid positions when released.
The issue was caused by rounding errors in the grid snap calculation.

- Use Math.round instead of Math.floor for grid alignment
- Add 0.5 offset before rounding for proper centering

Milestone: 0.2 - Basic Modeling
Time-spent: 45m
Fixes #28
```

### Example 3: Documentation

```
docs: add architecture overview

Document the high-level architecture including:
- Four-layer design (UI, Model, Metamodel, Persistence)
- Technology stack choices and rationale
- File structure for model repositories
- ArchiMate MVP element coverage

Time-spent: 2h
```

### Example 4: Breaking Change

```
feat(persistence)!: change model file format to split by layer

BREAKING CHANGE: Model files are now split by layer instead of
a single monolithic file. Existing models need migration.

Previous format: model.json (all elements)
New format: elements/{layer}/*.json

This enables better git diffs and reduces merge conflicts when
multiple people edit different layers.

Milestone: 0.2 - Basic Modeling
Time-spent: 4h
Closes #45
```

## Quality Checks

Before presenting the message, verify:

- [ ] Subject ≤72 characters
- [ ] Subject uses imperative mood
- [ ] Subject has no trailing period
- [ ] Type is valid conventional commit type
- [ ] Scope matches project conventions (if used)
- [ ] Body explains what and why
- [ ] Breaking changes documented in footer
- [ ] Issue references use correct format (#123)
- [ ] Milestone included if work relates to a milestone
- [ ] Time-spent included (ask user if not known)

## Error Handling

**No changes to commit:**
```
No changes detected. Stage files with `git add` first, or specify files to include.
```

**Not a git repository:**
```
This directory is not a git repository. Run `git init` first.
```

**Unstaged changes only:**
```
Found unstaged changes. Would you like to:
1. Stage all changes (git add -A)
2. Stage specific files
3. Show what's changed first
```
