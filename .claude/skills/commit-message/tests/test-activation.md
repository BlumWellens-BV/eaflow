# Activation Tests - commit-message Skill

## Purpose
Verify that the commit-message skill activates correctly with various trigger phrases.

## Test Matrix

| # | Trigger Phrase | Should Activate | Notes |
|---|----------------|-----------------|-------|
| 1 | "create commit message" | ✅ Yes | Primary trigger |
| 2 | "Create commit message for my changes" | ✅ Yes | With context |
| 3 | "commit message" | ✅ Yes | Short form |
| 4 | "format commit" | ✅ Yes | Alternative phrasing |
| 5 | "ready to commit" | ✅ Yes | Workflow trigger |
| 6 | "I'm ready to commit these changes" | ✅ Yes | Natural language |
| 7 | "create a new feature" | ❌ No | Feature work, not commit |
| 8 | "push to remote" | ❌ No | Git operation, not commit message |
| 9 | "what is a commit?" | ❌ No | Educational question |

## Expected Behavior

### When Activated
1. Skill checks git status
2. Skill collects diff statistics
3. Skill determines type and scope
4. Skill generates formatted commit message
5. Skill presents for review
6. Skill creates commit on approval

### When Not Activated
- Claude responds normally without loading skill
- No commit message generation occurs
