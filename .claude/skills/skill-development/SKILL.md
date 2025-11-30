---
name: skill-development
description: Creates, validates, and maintains Claude Skills for the EAFlow project. Use when creating new skills, validating existing skills, or improving skill quality. Includes go/no-go validation gates and ROI analysis to prevent skill sprawl.
version: 1.0.0
status: production

# Integration
component: skills
work-type: INFRASTRUCTURE

# Capabilities
allowed-tools: Read, Write, Edit, Bash, Glob, Grep

# Dependencies
depends-on: []
conflicts-with: []

# Maintenance
author: EAFlow Team
maintainer: eaflow@blumwellens.be
created: 2025-01-15
updated: 2025-01-15
github-issue: "N/A"
---

# Skill Development (Meta-Skill)

## Purpose

The Skill Development skill is the foundational meta-skill for creating, testing, maintaining, and validating all Claude Skills in EAFlow. It provides standards, templates, validation frameworks, and quality gates.

**Problem Solved**: Without systematic skill development practices, skills become inconsistent, poorly documented, untested, and difficult to maintain.

## When to Use

Activate this skill when you need to:

- **Create a new skill**: "Create a new skill for model validation"
- **Validate a skill**: "Validate the commit-message skill"
- **Improve a skill**: "Review and improve the test-infrastructure skill"
- **Document a skill**: "Generate documentation for a skill"

**Trigger keywords**: create skill, new skill, validate skill, improve skill, skill development, skill quality, skill documentation

## Instructions

### Phase 0: Validation Gate (Go/No-Go Decision)

Before creating a skill, evaluate whether it should be built:

1. **Problem Validation**

   a. **Frequency analysis**:
      - Daily (10+ times/day) → High frequency
      - Weekly (3-10 times/week) → Medium frequency
      - Monthly (1-10 times/month) → Low frequency
      - **REJECT if frequency <3 times/month** → Use bash alias instead

   b. **Impact analysis**:
      - All developers (3+) → High impact
      - Some developers (2) → Medium impact
      - **REJECT if only 1 developer affected** → Personal tool, not shared skill

   c. **Time cost analysis**:
      - Total monthly time cost = frequency × time_per_occurrence
      - **REJECT if total monthly cost <2 hours** → Not worth automation

2. **ROI Analysis**

   ```
   Development cost estimate:
   - Simple (template-only): 3-5h
   - Medium (template + logic): 8-15h
   - Complex (scripts + integration): 20-30h

   ROI = (Annual Savings / First-Year Cost) × 100%

   ROI Thresholds:
   - ≥200% → ✅ PROCEED
   - 100-199% → ⚠️ MARGINAL (user decides)
   - <100% → ❌ REJECT
   ```

3. **Alternative Assessment**

   - Can existing skill be extended?
   - Can bash alias/function solve this?
   - Is this a one-off need vs recurring pattern?

4. **Scope Validation**

   - **Too narrow?**: Single command wrapper → REJECT, suggest broader skill
   - **Too broad?**: 5+ distinct problems → REJECT, suggest splitting
   - **Appropriate**: 2-4 related sub-problems, 400-1000 lines SKILL.md

5. **Anti-Pattern Detection**

   - Automating bad practices? → REJECT
   - Duplicating existing tooling? → REJECT, suggest existing tool
   - Workaround for fixable root cause? → REJECT, fix root cause

### Phase 1: Skill Planning

When Phase 0 validation passes:

1. **Clarify Requirements**
   - Skill name (kebab-case)
   - Problem it solves
   - Trigger conditions
   - Needs templates? scripts? data files?

2. **Classify the Skill**
   - Component: `ui | canvas | model | persistence | metamodel | shared | skills`
   - Work Type: `MVP | INFRASTRUCTURE | TECH-DEBT`

### Phase 2: Skill Scaffolding

3. **Create Directory Structure**
   ```bash
   mkdir -p .claude/skills/{skill-name}/{templates,scripts,data,tests}
   ```

4. **Generate SKILL.md**

   Required sections:
   - YAML frontmatter with metadata
   - Purpose (problem + solution)
   - When to Use (triggers + keywords)
   - Instructions (step-by-step)
   - Examples (at least 2)
   - Quality Gates
   - Error Handling
   - Performance Considerations

5. **Create README.md**
   - Overview and purpose
   - Usage examples
   - Features list
   - Limitations
   - Related skills

6. **Initialize CHANGELOG.md**
   ```markdown
   ## [1.0.0] - YYYY-MM-DD
   ### Added
   - Initial release
   - {List key features}
   ```

### Phase 3: Quality Assurance

7. **Run Quality Checklist**

   **Structure & Format**:
   - [ ] Directory follows kebab-case naming
   - [ ] SKILL.md exists with valid YAML frontmatter
   - [ ] README.md exists
   - [ ] CHANGELOG.md exists

   **Content Quality**:
   - [ ] Description ≥50 chars with trigger conditions
   - [ ] Purpose clearly states problem solved
   - [ ] Instructions are step-by-step
   - [ ] ≥2 examples with inputs/outputs
   - [ ] Error handling covers common failures
   - [ ] Quality gates define success criteria

   **Technical Compliance**:
   - [ ] Version follows semver (X.Y.Z)
   - [ ] All `allowed-tools` are valid

   **Performance**:
   - [ ] SKILL.md ≤1000 lines
   - [ ] Token usage estimated

### Phase 4: Testing

8. **Create Test Cases**
   - `test-activation.md`: Verify skill activates with trigger phrases
   - `test-basic-usage.md`: Verify core functionality
   - `test-edge-cases.md`: Verify handling of invalid inputs

9. **Test Activation**
   | Trigger Phrase | Should Activate | Pass/Fail |
   |----------------|-----------------|-----------|
   | "{trigger 1}" | ✅ Yes | |
   | "{trigger 2}" | ✅ Yes | |

### Phase 5: Documentation

10. **Update Skills Catalog**
    Add entry to `.claude/skills/README.md`:
    ```markdown
    ### {Skill Name}
    **Status**: {status} | **Version**: {version}
    {Brief description}
    **Triggers**: {key phrases}
    ```

11. **Final Review**
    ```markdown
    ## Skill Created: {Skill Name}

    **Status**: {status}
    **Version**: {version}
    **Quality Score**: {passed}/{total} checks

    ### Files Created
    - .claude/skills/{skill-name}/SKILL.md
    - .claude/skills/{skill-name}/README.md
    - .claude/skills/{skill-name}/CHANGELOG.md

    ### Next Steps
    1. Test activation with trigger phrases
    2. Iterate based on real usage
    3. Update version when production-ready
    ```

## Examples

**Example 1: Create Basic Skill**

```
User: "Create a new skill for ArchiMate element validation"

Claude (using skill-development):
1. Phase 0 Validation:
   - Frequency: Daily (high) ✅
   - Impact: All developers ✅
   - Time cost: 15min/day = 5h/month ✅
   - ROI: 600% ✅
   - Scope: Appropriate (2-3 sub-problems) ✅

2. Phase 1 Planning:
   - Name: archimate-validation
   - Problem: Developers manually validate elements against ArchiMate spec
   - Triggers: "validate element", "check ArchiMate compliance"

3. Phase 2 Scaffolding:
   - Creates directory structure
   - Generates SKILL.md with validation rules
   - Adds ArchiMate layer/relationship rules as data files

4. Phase 3 Quality:
   - All checks pass (18/18)

5. Phase 4 Testing:
   - Activation tests pass
   - Validation rules work correctly

Result: archimate-validation skill created and ready
```

**Example 2: Skill Rejected - Low ROI**

```
User: "Create a skill to auto-capitalize element names"

Claude (using skill-development):
1. Phase 0 Validation:
   - Frequency: ~2 times/month (LOW)
   - Impact: 1 developer (LOW)
   - Time cost: 2min × 2 = 4min/month (0.07h)
   - ROI: 17% ❌

### ❌ FINAL DECISION: REJECT

**Reason**: Negative ROI - development cost exceeds benefit

**Alternative**: Use text editor shortcut or regex replace:
- VS Code: Ctrl+Shift+P → Transform to Title Case
- Or: element.name.replace(/\b\w/g, c => c.toUpperCase())

**Impact if NOT Built**: Minimal - saves 4 minutes/month
```

**Example 3: Validate Existing Skill**

```
User: "Validate the lint-format-auto-fixer skill"

Claude (using skill-development):
1. Reads .claude/skills/lint-format-auto-fixer/SKILL.md

2. Runs quality checklist:
   - Structure: 4/4 ✅
   - Content: 6/6 ✅
   - Technical: 3/3 ✅
   - Performance: 2/2 ✅

   Score: 15/15 (100%)

3. Reports: lint-format-auto-fixer skill validated successfully
```

## Quality Gates

**Phase 0 Validation**:
- [ ] Problem frequency ≥3 times/month
- [ ] Impact ≥2 developers
- [ ] Monthly time cost ≥2 hours
- [ ] ROI ≥200%
- [ ] Cannot be solved with bash alias
- [ ] Appropriate scope
- [ ] Does NOT automate bad practices
- [ ] Does NOT duplicate existing tools

**Skill Implementation**:
- [ ] All quality checklist items pass
- [ ] At least 2 test cases created
- [ ] README.md complete
- [ ] CHANGELOG.md initialized
- [ ] Skill activates with trigger phrases
- [ ] Added to skills catalog

## Error Handling

### Error: YAML Frontmatter Invalid

**Solution**:
1. Check for missing colons after field names
2. Ensure strings with special characters are quoted
3. Validate arrays use proper syntax: `[item1, item2]`

### Error: Skill Doesn't Activate

**Solution**:
1. Check description includes trigger keywords
2. Make description more specific (≥50 chars)
3. Add explicit "Use when..." clause
4. Test with multiple phrasings

### Error: Quality Checks Fail

**Solution**:
1. Review specific failed checks
2. Fix issues one category at a time
3. Re-run validation after each fix

## Performance Considerations

### Token Usage
- **Activation**: ~3000 tokens
- **Per skill creation**: ~5000-8000 tokens

### Execution Time
- **Scaffolding**: 5-10 seconds
- **Validation**: 2-5 seconds
- **Full skill creation**: 1-3 minutes

## Related Skills

### Skills Created Using This Meta-Skill
- **commit-message**: Commit message generation
- **lint-format-auto-fixer**: ESLint/Prettier automation
- **test-infrastructure**: TDD/BDD test scaffolding
- **typescript-type-safety-enforcer**: Type safety automation

## Best Practices

### Phase 0: Validation
1. **Always run Phase 0 first**: Never skip validation gate
2. **Be ruthless with ROI**: 200% minimum
3. **Challenge the problem**: Ask "why" 3 times for root cause
4. **Quantify everything**: Get specific numbers, not vague claims
5. **Embrace rejection**: Rejecting weak ideas protects against sprawl

### Implementation
6. **Start with the problem**: Always clarify what problem the skill solves
7. **Keep skills focused**: One skill = one capability
8. **Write clear descriptions**: Include what, when, and keywords
9. **Provide concrete examples**: At least 2, with real inputs/outputs
10. **Test activation early**: Verify skill loads with expected triggers

### Anti-Patterns to Avoid
- ❌ **Skill sprawl**: Many narrow skills instead of few focused ones
- ❌ **Optimism bias**: Building "might be useful someday" skills
- ❌ **Automation for automation's sake**: Skills that cost more to build than they save
- ❌ **Ignoring alternatives**: Custom skill when bash alias suffices
- ❌ **Masking symptoms**: Automating workarounds instead of fixing root causes

## Maintenance

### Updating This Skill
1. Use this skill to validate itself
2. Use this skill to improve itself
3. Follow semantic versioning
4. Update CHANGELOG.md with all changes

### Known Issues
- **Version 1.0.0**: Initial release for EAFlow

### Roadmap
- **v1.1.0**: Add automated validation script
- **v1.2.0**: Add skill register integration
