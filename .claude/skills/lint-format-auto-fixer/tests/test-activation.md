# Test: Skill Activation

This test verifies that the lint-format-auto-fixer skill activates with appropriate trigger phrases.

## Test Objective

Confirm that the skill activates when users request lint/format fixes and does NOT activate for unrelated requests.

## Test Cases

### Test 1: Direct ESLint Error Fix Request

**Input**: "Fix ESLint errors in my code"

**Expected**: ✅ Skill activates

**Rationale**: Direct mention of "Fix ESLint" should trigger skill

---

### Test 2: Pre-Commit Hook Failure

**Input**: "Pre-commit failed with lint errors"

**Expected**: ✅ Skill activates

**Rationale**: Pre-commit + lint errors indicates linting issue

---

### Test 3: Prettier Formatting Request

**Input**: "Fix Prettier formatting issues"

**Expected**: ✅ Skill activates

**Rationale**: Prettier formatting is core skill feature

---

### Test 4: React Hook Error

**Input**: "React Hook called in non-component function error"

**Expected**: ✅ Skill activates

**Rationale**: Specific error pattern mentioned in skill description

---

### Test 5: Console Statement Cleanup

**Input**: "Remove console statements from my API code"

**Expected**: ✅ Skill activates

**Rationale**: Console statement handling is core feature

---

### Test 6: Unused Variable Error

**Input**: "Fix unused variable errors"

**Expected**: ✅ Skill activates

**Rationale**: Unused variables is listed error pattern

---

### Test 7: CI/CD Lint Failure

**Input**: "CI lint errors blocking deployment"

**Expected**: ✅ Skill activates

**Rationale**: CI lint errors + deployment blocking indicates linting issue

---

### Test 8: Generic "Fix Lint"

**Input**: "fix lint"

**Expected**: ✅ Skill activates

**Rationale**: Minimal trigger phrase, should activate

---

### Test 9: Auto-Fix Request

**Input**: "auto-fix formatting"

**Expected**: ✅ Skill activates

**Rationale**: "auto-fix" + "formatting" in skill triggers

---

### Test 10: JSX Quote Error

**Input**: "JSX quote escaping error"

**Expected**: ✅ Skill activates

**Rationale**: Specific error pattern in skill

---

### Test 11: Type Error Fix

**Input**: "Fix no-explicit-any errors"

**Expected**: ✅ Skill activates

**Rationale**: Specific ESLint rule mentioned in skill

---

## Negative Test Cases (Should NOT Activate)

### Test 12: General Code Request

**Input**: "Write a function to calculate fibonacci"

**Expected**: ❌ Skill does NOT activate

**Rationale**: No lint/format keywords

---

### Test 13: Feature Implementation

**Input**: "Add a new authentication feature"

**Expected**: ❌ Skill does NOT activate

**Rationale**: Feature development, not linting

---

### Test 14: Bug Fix (Not Lint)

**Input**: "Fix the login bug"

**Expected**: ❌ Skill does NOT activate

**Rationale**: Functional bug, not lint error

---

### Test 15: Database Query

**Input**: "Optimize this database query"

**Expected**: ❌ Skill does NOT activate

**Rationale**: Performance optimization, not linting

---

### Test 16: Documentation Request

**Input**: "Update the README file"

**Expected**: ❌ Skill does NOT activate

**Rationale**: Documentation work, not linting

---

## Activation Matrix

| Trigger Phrase | Should Activate | Pass/Fail |
|----------------|-----------------|-----------|
| "Fix ESLint errors" | ✅ Yes | |
| "Pre-commit failed with lint" | ✅ Yes | |
| "Fix Prettier formatting" | ✅ Yes | |
| "React Hook error" | ✅ Yes | |
| "Remove console statements" | ✅ Yes | |
| "Fix unused variable" | ✅ Yes | |
| "CI lint errors" | ✅ Yes | |
| "fix lint" | ✅ Yes | |
| "auto-fix formatting" | ✅ Yes | |
| "JSX quote error" | ✅ Yes | |
| "no-explicit-any error" | ✅ Yes | |
| "Write fibonacci function" | ❌ No | |
| "Add authentication" | ❌ No | |
| "Fix login bug" | ❌ No | |
| "Optimize query" | ❌ No | |
| "Update README" | ❌ No | |

## Test Execution

### Manual Testing

1. Open Claude Code in the Numonic codebase
2. For each test case, enter the input phrase
3. Observe if skill activates (check for skill context loading)
4. Mark Pass/Fail in matrix above
5. Document any unexpected activations or failures

### Expected Results

- **Positive tests**: 11/11 should activate (100%)
- **Negative tests**: 5/5 should NOT activate (100%)
- **Overall accuracy**: 16/16 correct classifications (100%)

## Debugging Failed Activations

If skill doesn't activate when expected:

1. **Check description field** in SKILL.md frontmatter
   - Must contain trigger keywords
   - Must be ≥50 characters
   - Should include "fix", "lint", "ESLint", "Prettier", etc.

2. **Check skill file location**
   - Must be in `.claude/skills/lint-format-auto-fixer/`
   - File must be named `SKILL.md`

3. **Check YAML frontmatter**
   - Must be valid YAML
   - Must have `description` field
   - Must have `name: lint-format-auto-fixer`

4. **Check Claude Code version**
   - Ensure using Claude Code with skill support
   - Try reloading/restarting Claude Code

## Success Criteria

- [ ] All 11 positive tests activate skill
- [ ] All 5 negative tests do NOT activate skill
- [ ] No false positives (skill activating for unrelated tasks)
- [ ] No false negatives (skill not activating for lint tasks)
- [ ] Skill activates within 2 seconds of user request

## Notes

- Skill activation is based on description field matching
- Partial matches should work (e.g., "lint" matches "linting")
- Case insensitive matching expected
- Skill should NOT activate for general code requests
