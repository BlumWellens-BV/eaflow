# Skill Development (Skill 0)

**Version**: 0.1.0
**Status**: Beta
**Maintained by**: Numonic Team

## Purpose

The Skill Development skill is the foundational meta-skill that enables systematic creation, validation, and maintenance of all Claude Skills in the Numonic platform. It provides templates, scaffolding, quality frameworks, and best practices to ensure every skill is consistent, well-documented, performant, and maintainable.

**Problem Solved**: Without standardized skill development practices, skills become inconsistent in quality, poorly documented, untested, and difficult to maintain across the team.

## Installation

This skill is included in the Numonic project at `.claude/skills/skill-development/`.

No additional setup required. The skill is automatically available to Claude Code.

## Usage

### When Does This Activate?

Claude will automatically use this skill when you:

- Request to **create a new skill**: "Create a new skill for work tracking"
- Request to **validate a skill**: "Validate the commit-message skill"
- Request to **improve a skill**: "Review and improve the work-tracking skill"
- Request to **document a skill**: "Generate documentation for the API route generator"
- Request skill-related operations: "scaffold skill structure", "check skill quality"

### Example Requests

**Example 1: Create New Skill**
```
User: "Create a new skill for formatting commit messages according to our CLAUDE.md standards"

Claude: I'll help you create the commit-message skill. Let me ask a few questions:
1. Should it include GitLab issue integration?
2. Does it need to calculate metrics automatically?
3. Should it validate against work types (DEMO/MVP/etc)?

[After answers, Claude creates full skill structure with all required files]

Result: New skill at .claude/skills/commit-message/ with SKILL.md, README.md, CHANGELOG.md, templates, and tests
```

**Example 2: Validate Existing Skill**
```
User: "Validate the work-tracking skill and check if it meets all quality standards"

Claude: Running quality gate checklist on work-tracking skill...

Structure & Format: 5/5 ✅
Content Quality: 5/6 ⚠️ (missing 2nd example)
Technical Compliance: 5/5 ✅
Performance: 3/4 ⚠️ (token usage not documented)
Testing: 4/4 ✅
Documentation: 5/5 ✅
Integration: 5/5 ✅

Score: 32/34 (94%)

Issues found:
1. SKILL.md needs second example
2. README.md needs token usage estimate

Would you like me to fix these automatically?
```

**Example 3: Self-Improvement (Meta!)**
```
User: "Use the skill-development skill to improve itself"

Claude: I'll review the skill-development skill against its own standards...

[Analyzes SKILL.md, runs quality checks, identifies improvements]

Improvements identified:
1. Add performance benchmarking section
2. Create automation script for scaffolding
3. Add more edge case examples
4. Estimate token usage more precisely

Shall I implement these improvements?
```

## Features

- ✅ **Skill Scaffolding**: Auto-generates directory structure and required files
- ✅ **Template Library**: Provides templates for SKILL.md, README.md, CHANGELOG.md
- ✅ **Quality Validation**: 34-point checklist covering structure, content, performance, testing
- ✅ **Interactive Creation**: Asks clarifying questions to gather requirements
- ✅ **Automatic Classification**: Determines work type, business value, component tags
- ✅ **Test Case Generation**: Creates test templates for activation, basic usage, edge cases
- ✅ **Documentation Generation**: Auto-fills documentation templates with skill details
- ✅ **Self-Application**: Can improve itself (meta-testing)
- ✅ **Standards Enforcement**: Ensures all skills follow Numonic conventions

## Configuration

No configuration required. All settings are embedded in the skill itself.

### Customization Options

To customize skill creation templates, edit files in:
- `.claude/skills/skill-development/templates/skill-template/`
- `.claude/skills/skill-development/templates/docs/`

To customize quality gates, edit:
- `.claude/skills/skill-development/schemas/quality-checklist.md`

## Performance

- **Activation Time**: ~1s (skill loading)
- **Scaffolding Time**: 5-10s (directory + file creation)
- **Validation Time**: 2-5s (quality checks)
- **Full Skill Creation**: 1-3 min (interactive with user input)
- **Token Usage**: ~3000-5000 tokens per activation

### Optimization Notes

- Skill is optimized for clarity over token efficiency (this is meta-infrastructure)
- Template files are lazy-loaded (only read when creating skills)
- Validation is performed on-demand (not automatic)

## Limitations

- **Beta Status (v0.1.0)**: Not yet production-ready, will be refined based on usage
- **No Automated Validation Scripts**: Quality checks are manual (planned for v0.2.0)
- **No JSON Schema Validation**: YAML validation is manual (planned for v0.2.0)
- **No Performance Benchmarking Tools**: Performance metrics are estimated (planned for v0.3.0)
- **File System Only**: Requires local file access, no API/cloud operations
- **Interactive Mode**: Requires user input, not fully automated

## Troubleshooting

### Issue: Skill Doesn't Activate

**Symptoms**: Request to create/validate skill doesn't trigger this skill

**Solutions**:
1. Use explicit trigger phrases: "create skill", "validate skill", "skill development"
2. Ensure request is about skill development (not general development)
3. Check `.claude/skills/skill-development/SKILL.md` exists
4. Verify YAML frontmatter is valid
5. Try: "Use the skill-development skill to create a new skill"

### Issue: Quality Checks Fail

**Symptoms**: Many validation failures reported

**Solutions**:
1. Review specific failed checks (organized by category)
2. Refer to `.claude/skills/skill-development/schemas/quality-checklist.md`
3. Fix issues incrementally (one category at a time)
4. Request automatic fixes: "Fix the validation issues automatically"
5. Re-validate after fixes

### Issue: Generated Files Have Placeholders

**Symptoms**: Files contain `{placeholder}` values

**Solutions**:
1. Provide more specific information in initial request
2. Answer all clarifying questions completely
3. Request regeneration: "Regenerate the README with correct values"
4. Edit placeholders manually using Edit tool
5. Re-run skill creation with complete input

### Issue: Skill Creation is Slow

**Symptoms**: Takes >3 minutes to create skill

**Solutions**:
1. This is expected for comprehensive skills (many files/templates)
2. For simple skills, omit optional components: "Create minimal skill without examples"
3. Create scaffolding first, fill in later: "Just create the directory structure"
4. Use incremental approach: Create → Validate → Iterate

## Related Skills

### Future Skills That Will Use This

Once additional skills are created, they will leverage skill-development for:

- **work-tracking** (Skill 1): Will be first skill created using Skill 0
- **commit-message** (Skill 2): Commit formatting with Skill 0 quality standards
- **release-management** (Skill 3): Release workflows using Skill 0 patterns
- **gitlab-integration** (Skill 4): GitLab ops following Skill 0 standards

### Composes Well With

When these skills exist, skill-development will work alongside:

- **work-tracking**: Create skills as part of tracked work sessions
- **commit-message**: Format commits for skill changes with proper metrics
- **gitlab-integration**: Create GitLab issues for new skill development

## Architecture

### How It Works

1. **Activation**: Claude detects skill-related request via description matching
2. **Requirements Gathering**: Asks clarifying questions about skill purpose, triggers, components
3. **Scaffolding**: Creates directory structure and required files from templates
4. **Generation**: Fills templates with skill-specific content
5. **Validation**: Runs 34-point quality checklist
6. **Testing**: Generates test case templates
7. **Documentation**: Creates README and CHANGELOG
8. **Reporting**: Presents summary with quality score and next steps

### Key Components

| Component | Purpose | Location |
|-----------|---------|----------|
| **SKILL.md** | Main skill definition and instructions | `.claude/skills/skill-development/SKILL.md` |
| **Templates** | File templates for new skills | `.claude/skills/skill-development/templates/` |
| **Schemas** | Validation schemas and checklists | `.claude/skills/skill-development/schemas/` |
| **Scripts** | Helper scripts (future: automation) | `.claude/skills/skill-development/scripts/` |
| **Tests** | Test cases for Skill 0 itself | `.claude/skills/skill-development/tests/` |

## Development

### Modifying This Skill

To modify the skill-development skill:

1. **Self-Application Test**: Use Skill 0 to validate changes
   ```
   "Validate the skill-development skill"
   ```

2. **Update SKILL.md**: Make changes to instructions or metadata

3. **Update Version**: Follow semantic versioning
   - Bug fixes: 0.1.0 → 0.1.1 (PATCH)
   - New features: 0.1.0 → 0.2.0 (MINOR)
   - Breaking changes: 0.1.0 → 1.0.0 (MAJOR)

4. **Update CHANGELOG.md**: Document all changes

5. **Re-validate**: Run quality checks
   ```
   "Validate the skill-development skill after my changes"
   ```

6. **Test**: Verify by creating a test skill
   ```
   "Create a test skill to verify skill-development works correctly"
   ```

### Adding New Templates

To add new skill templates:

1. Create template file in `.claude/skills/skill-development/templates/`
2. Use `{placeholder}` syntax for variable content
3. Document placeholders in template header
4. Update SKILL.md instructions to reference new template
5. Add template to quality checklist if it becomes required

### Adding New Quality Gates

To add new quality checks:

1. Edit `.claude/skills/skill-development/schemas/quality-checklist.md`
2. Add check to appropriate category
3. Update total count in instructions
4. Document rationale for new check
5. Update validation script (when available)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for version history.

## Contributing

See [.claude/skills/CONTRIBUTING.md](../CONTRIBUTING.md) (to be created) for how to modify skills.

For now, to contribute:
1. Use skill-development to validate your changes
2. Follow quality gates (34-point checklist)
3. Update CHANGELOG.md
4. Test by creating a sample skill
5. Commit with proper format (use commit-message skill when available)

## Support

For issues or questions:

- **Create GitLab issue**: Label with `skill:skill-development`
- **Slack**: Post in #development channel
- **Documentation**: Review design docs in `docs/research/`:
  - `claude-skills-evaluation.md`
  - `claude-skills-technical-spec.md`
  - `skill-0-design-document.md`

## References

- [Anthropic Skills Documentation](https://docs.claude.com/en/docs/claude-code/skills)
- [Anthropic Skills GitHub](https://github.com/anthropics/skills)
- [Numonic Skills Evaluation](../../../docs/research/claude-skills-evaluation.md)
- [Skills Technical Spec](../../../docs/research/claude-skills-technical-spec.md)
- [Skill 0 Design Document](../../../docs/research/skill-0-design-document.md)

---

**Created**: 2025-10-17
**Status**: Beta (v0.1.0)
**Next Milestone**: v1.0.0 after successfully creating Work Tracking Skill
