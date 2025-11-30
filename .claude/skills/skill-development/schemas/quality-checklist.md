# Skill Quality Gate Checklist

**Version**: 1.2.0
**Total Checks**: 36
**Passing Score**: 100% (all checks must pass for production)

---

## How to Use This Checklist

1. **For New Skills**: Run through all checks before declaring skill complete
2. **For Existing Skills**: Use for validation and improvement
3. **For Skill Reviews**: Use as audit framework
4. **Scoring**: Each category weighted equally, aim for 34/34

---

## Category 1: Structure & Format (5 checks)

- [ ] **1.1** Directory follows naming convention (kebab-case, no spaces)
- [ ] **1.2** SKILL.md exists with valid YAML frontmatter
- [ ] **1.3** README.md exists and is complete
- [ ] **1.4** CHANGELOG.md exists with version history
- [ ] **1.5** All required files present based on skill type (templates/, scripts/, data/, tests/)

**Category Score**: ___/5

---

## Category 2: Content Quality (6 checks)

- [ ] **2.1** Description is ≥50 characters and includes trigger conditions
- [ ] **2.2** Purpose section clearly states problem being solved
- [ ] **2.3** Instructions are step-by-step and unambiguous
- [ ] **2.4** At least 2 concrete examples provided with inputs/outputs
- [ ] **2.5** Error handling section covers common failure modes
- [ ] **2.6** Quality gates define success criteria

**Category Score**: ___/6

---

## Category 3: Technical Compliance (6 checks)

- [ ] **3.1** YAML frontmatter validates against schema (all required fields present)
- [ ] **3.2** Version follows semantic versioning (X.Y.Z format)
- [ ] **3.3** All `allowed-tools` are valid Claude Code tools
- [ ] **3.4** Dependencies listed and validated (exist if referenced)
- [ ] **3.5** Conflicts documented if any (or explicitly marked as none)
- [ ] **3.6** **Model-agnostic**: NO `model` field in YAML (skills must work with any Claude model)

**Valid Tools**: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, Task, NotebookEdit, WebSearch, WebFetch, Skill, SlashCommand, AskUserQuestion

**IMPORTANT**: Skills should NEVER specify a required model. They must be model-agnostic and work correctly with Sonnet, Haiku, Opus, or any future Claude model.

**Category Score**: ___/6

---

## Category 4: Performance (4 checks)

- [ ] **4.1** SKILL.md is ≤1000 lines (move verbose content to reference docs)
- [ ] **4.2** Skill activation tested and takes <2 seconds
- [ ] **4.3** Token usage estimated and documented
- [ ] **4.4** No blocking operations without timeouts

**Category Score**: ___/4

---

## Category 5: Testing (4 checks)

- [ ] **5.1** Manual test cases documented in tests/ directory
- [ ] **5.2** All test cases pass with expected outputs
- [ ] **5.3** Edge cases tested (empty inputs, invalid data, error conditions)
- [ ] **5.4** Skill tested in isolation and with other skills (no conflicts)

**Minimum Test Cases**:
- `test-activation.md`: Verify trigger phrases activate skill
- `test-basic-usage.md`: Verify core functionality
- `test-edge-cases.md`: Verify error handling

**Category Score**: ___/4

---

## Category 6: Documentation (5 checks)

- [ ] **6.1** README.md includes installation instructions (even if just "included in project")
- [ ] **6.2** README.md includes usage examples with trigger phrases
- [ ] **6.3** README.md includes troubleshooting section
- [ ] **6.4** Related skills documented (dependencies, composes-with, conflicts)
- [ ] **6.5** Known limitations documented

**Category Score**: ___/5

---

## Category 7: Integration (Numonic-specific) (6 checks)

- [ ] **7.1** Work type classified correctly (DEMO|MVP|INFRASTRUCTURE|YAK|TECH-DEBT)
- [ ] **7.2** Business value classified correctly (MOAT|SHARE|INTERNAL)
- [ ] **7.3** Component tagged correctly (web|desktop|worker|backend|packages|shared|skills)
- [ ] **7.4** GitLab issue referenced (if applicable) or explicitly marked as N/A
- [ ] **7.5** CLAUDE.md alignment verified (follows project standards)
- [ ] **7.6** P16 capability map updated (L2 page, skill heat map in Steering Dashboard, P16 main page, skills README L2 reference)

**Category Score**: ___/6

---

## Total Score

**Overall**: ___/36

**Percentage**: ___%

**Status**:
- **100%** (36/36): ✅ Production Ready
- **90-99%** (33-35): ⚠️ Near Ready (fix remaining issues)
- **80-89%** (29-32): ⚠️ Good Progress (address gaps)
- **<80%** (<29): ❌ Needs Significant Work

---

## Detailed Validation Guide

### 1.1 Directory Naming
**Valid**: `work-tracking`, `commit-message`, `api-route-generator`
**Invalid**: `workTracking`, `Work_Tracking`, `work tracking`

### 1.2 YAML Frontmatter Required Fields
```yaml
name: skill-name           # Required
description: ...           # Required, ≥50 chars
version: X.Y.Z            # Required
status: active|beta|deprecated|archived  # Optional but recommended
```

### 2.1 Description Quality
**Good**: "Automates creation of work tracking files with GitLab integration. Use when starting new development tasks, tracking work sessions, or logging yak shaving time."

**Poor**: "Work tracking" (too short, no triggers)

### 2.4 Example Quality
**Good Example**:
```markdown
User: "Create a work tracking file for feature X"

Claude (using work-tracking):
1. Asks for GitLab milestone and issue
2. Creates .llm/context/work-tracking/2025-10-17-feature-x.md
3. Pre-fills template with metadata
4. Starts session timer

Result: Work tracking file created at .llm/context/work-tracking/2025-10-17-feature-x.md
```

**Poor Example**:
```markdown
User uses the skill and it works.
```

### 4.1 File Size Check
```bash
wc -l .claude/skills/{skill-name}/SKILL.md
```
Should output ≤1000 lines

### 4.3 Token Estimation
Use this rough formula:
- 1 token ≈ 4 characters
- SKILL.md file size in chars / 4 = token estimate

Example: 10,000 character file ≈ 2,500 tokens

### 5.4 Conflict Testing
Activate multiple skills and verify no issues:
```
"Use skill-1 and skill-2 together to do X"
```
Monitor for:
- Conflicting instructions
- Duplicate operations
- Resource conflicts

### 7.6 P16 Capability Map Documentation
When creating or updating a skill, ensure the following wiki documentation is updated:

**Required Updates:**
1. **L2 Capability Page** (`docs/wiki/P16-L2-{category}.md`):
   - Add skill section with status, purpose, features, impact metrics
   - Determine correct L2 category:
     - P16-L2.1 (Work & Decision Tracking): Skills 1, 2
     - P16-L2.2 (Knowledge Management Integration): Skills 4, 5
     - P16-L2.3 (Development Automation): Skills 7, 8, 9+
     - P16-L2.4 (Release & Distribution): Skills 3, 6

2. **Skill Coverage Heat Map** (`docs/wiki/Steering-Dashboard-Operations.md`):
   - Add new row with skill number, name, L2 capability, maturity levels
   - Update "Overall Progress" metrics (X/15 implemented, Y%)
   - Update "Aggregate Impact" if metrics available

3. **P16 Main Page** (`docs/wiki/P16-Developer-Experience-Productivity.md`):
   - Add to "Implemented Skills" (Beta) or "Planned Skills" list
   - Update maturity assessment if needed
   - Update ROI metrics if impact data available

4. **Skills README** (`.claude/skills/README.md`):
   - Update quick reference table with L2 capability link
   - Ensure skill entry includes correct L2 category reference

**Validation Commands:**
```bash
# Check L2 page has skill entry
grep -A 5 "Skill.*{skill-name}" docs/wiki/P16-L2-*.md

# Check heat map has skill row
grep "{skill-name}" docs/wiki/Steering-Dashboard-Operations.md

# Check P16 main page lists skill
grep "{skill-name}" docs/wiki/P16-Developer-Experience-Productivity.md

# Check skills README has L2 reference
grep "{skill-name}.*P16-L2" .claude/skills/README.md
```

---

## Quick Validation Commands

```bash
# Check directory structure
ls -la .claude/skills/{skill-name}/

# Count lines in SKILL.md
wc -l .claude/skills/{skill-name}/SKILL.md

# Validate YAML syntax (requires yq or similar)
head -n 30 .claude/skills/{skill-name}/SKILL.md | yq eval -

# Check for required sections
grep -E "^## (Purpose|When to Use|Instructions|Examples|Quality Gates|Error Handling)" \
  .claude/skills/{skill-name}/SKILL.md
```

---

## Common Issues and Fixes

| Issue | Fix |
|-------|-----|
| **Description too short** | Add trigger conditions and keywords |
| **Missing examples** | Add 2+ examples with full input/output |
| **No error handling** | Document 3+ common errors with solutions |
| **SKILL.md too long** | Move examples to `examples/`, reference docs to `reference.md` |
| **No tests** | Create `tests/test-activation.md` and `tests/test-basic-usage.md` |
| **README incomplete** | Use template from `.claude/skills/skill-development/templates/docs/` |

---

## Checklist Maintenance

**When to Update**:
- New quality standards adopted
- New tool added to Claude Code
- New Numonic-specific requirements
- Feedback from skill reviews

**Version History**:
- v1.2.0 (2025-10-18): Added check 7.6 (P16 capability map documentation), 36 total checks
- v1.1.0 (2025-10-18): Added check 3.6 (model-agnostic requirement), 35 total checks
- v1.0.0 (2025-10-17): Initial 34-point checklist

---

**References**:
- [Skill 0 Design Document](../../../docs/research/skill-0-design-document.md)
- [Claude Skills Technical Spec](../../../docs/research/claude-skills-technical-spec.md)
- [CLAUDE.md](../../../CLAUDE.md)
