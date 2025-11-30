# Edge Cases Tests - commit-message Skill

## Purpose
Verify skill handles error conditions gracefully.

## Test Cases

### Test 1: No Git Repository

**Setup**: Directory without `.git` folder

**Expected Behavior**:
- Reports: "This directory is not a git repository."
- Offers: "Run `git init` first."
- No crash

---

### Test 2: No Changes to Commit

**Setup**: Clean working directory

**Expected Behavior**:
- Reports: "No changes detected."
- Suggests: "Stage files with `git add` first."
- No empty commit created

---

### Test 3: Subject Line Too Long

**Setup**: User provides verbose description

**Expected Behavior**:
- Detects length >72 chars
- Asks for shorter description
- Moves details to body

---

### Test 4: Mixed File Types

**Setup**: Changes across multiple scopes
- `src/metamodel/elements.ts`
- `src/canvas/Canvas.tsx`
- `docs/README.md`

**Expected Behavior**:
- Uses most significant scope, or omits
- Lists all affected areas in body
- Generates coherent message

---

### Test 5: Special Characters in Paths

**Setup**: Next.js-style routes like `app/api/[id]/route.ts`

**Expected Behavior**:
- Brackets handled correctly
- File categorized properly
- No parsing errors

---

### Test 6: User Cancellation

**Setup**: User says "cancel" mid-flow

**Expected Behavior**:
- Confirms cancellation
- Exits cleanly
- No partial commit
