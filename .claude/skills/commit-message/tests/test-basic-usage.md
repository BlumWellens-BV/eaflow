# Basic Usage Tests - commit-message Skill

## Purpose
Verify core commit message generation workflow.

## Test Cases

### Test 1: Generate Feature Commit

**Setup**:
- New TypeScript files added to `src/metamodel/`
- Changes add ArchiMate element type definitions

**Procedure**:
1. User: "Create commit message"
2. Skill analyzes changes
3. Skill suggests: `feat(metamodel): add ArchiMate element types`
4. User approves
5. Commit created

**Expected Output**:
```
feat(metamodel): add ArchiMate element types

Add TypeScript definitions for ArchiMate business layer elements
including Actor, Role, Process, Function, Event, Service, and Object.

- Define element interfaces with Zod schemas
- Add layer color constants
- Include JSDoc documentation

Closes #12
```

**Pass Criteria**:
- [ ] Type correctly identified as `feat`
- [ ] Scope correctly identified as `metamodel`
- [ ] Subject uses imperative mood
- [ ] Body explains the changes
- [ ] Issue reference formatted correctly

---

### Test 2: Generate Bug Fix Commit

**Setup**:
- Modified file in `src/canvas/`
- Fix for node positioning bug

**Procedure**:
1. User: "Ready to commit"
2. Skill analyzes diff
3. Skill suggests: `fix(canvas): correct node snap-to-grid`
4. User approves

**Expected Output**:
```
fix(canvas): correct node snap-to-grid

Nodes were snapping to wrong grid positions on drag end.

Fixes #28
```

**Pass Criteria**:
- [ ] Type correctly identified as `fix`
- [ ] Scope correctly identified as `canvas`
- [ ] Problem explained in body
- [ ] Uses `Fixes` for bug issues

---

### Test 3: Generate Documentation Commit

**Setup**:
- Only markdown files changed
- Updates to docs/architecture/overview.md

**Procedure**:
1. User: "Commit message"
2. Skill detects docs-only changes
3. Skill suggests: `docs: update architecture overview`

**Expected Output**:
```
docs: update architecture overview

Add technology stack details and file structure documentation.
```

**Pass Criteria**:
- [ ] Type correctly identified as `docs`
- [ ] No scope (optional for docs)
- [ ] Concise body

---

### Test 4: Handle Breaking Change

**Setup**:
- API changes in `src/persistence/`
- File format changed

**Procedure**:
1. User: "Create commit"
2. Skill detects significant changes
3. Skill asks: "Does this include breaking changes?"
4. User: "yes, file format changed"
5. Skill adds BREAKING CHANGE footer

**Expected Output**:
```
feat(persistence)!: split model file by layer

BREAKING CHANGE: Model files now split into elements/{layer}/*.json
instead of single model.json. Existing models require migration.
```

**Pass Criteria**:
- [ ] Breaking change indicator (!) in subject
- [ ] BREAKING CHANGE in footer
- [ ] Migration note included
