# Agent Guidelines & Workflow

This document defines the operating rules for AI agents working in this repository.

## 1. Initial Context & Environment

Before making code changes, and before non-trivial planning, follow these steps:

- **Repository analysis:** Run `npx gitnexus analyze` to refresh local repository context.
  - If the command fails, continue with the task and report the failure in your final response.
- **Architectural context:** Review existing ADRs in `docs/adr` when the task may affect architecture, cross-component conventions, system boundaries, or previously documented long-lived decisions.
- **Local technical context:** Review notes in `docs/technical-decisions` when the task may revisit or extend important local technical rationale.
- **Domain context:** Use the `rever-definitions` skill only when the task affects Rever entities, schema, persistence rules, or domain behavior.
- **Environment hygiene:** Ensure the following paths remain ignored and are never committed:
  - `.gitnexus`
  - `.claude/skills/gitnexus/`
  - `CLAUDE.md`
- **Branching rule:** Work only on the current branch. Do not use git worktrees.

## 2. Development & Testing Standards

We prioritize maintainability, minimal changes, and behavior-focused validation.

- **Behavior-first tests:** Prefer tests that verify user-visible or system-visible behavior rather than implementation details.
- **Test scope:** If you change behavior, add or update the narrowest relevant automated test coverage unless there is no sensible place to do so. If no test is added, explain why.
- **TDD cleanup:** If you use a TDD workflow, remove temporary or redundant intermediate tests before finishing the task.
- **Follow existing patterns:** Match the repository’s established code style, structure, and testing conventions unless the task explicitly requires a new pattern.

## 2.1 Repository-Specific Coding Conventions

- **Nested conditionals:** Agents MUST avoid nested `if` statements. Prefer alternatives such as early returns, guard clauses, or extracting small helper functions when conditional logic starts to nest.
- **Empty array checks:** Agents MUST use Lodash `_.isEmpty(...)` to verify whether an array is empty instead of length comparisons such as `array.length > 0`.
- **Property existence checks in comparisons:** When a comparison needs to safely verify an object property, agents MUST use optional chaining (`?.`) instead of truthiness checks such as `value.type && value.type !== currentItem.type`. If an explicit truthiness check is required, agents MUST use an explicit cast such as `Boolean(value?.type)` instead of presence checks such as `value?.type !== undefined`.

## 3. Completion & Documentation

A task is complete only when all applicable items below are satisfied:

1. **Tests:** Run the most relevant automated tests for the changed behavior and report what was executed.
2. **Decision records:** Document lasting technical decisions using the appropriate artifact:
   - Create an ADR in `docs/adr` when the change introduces or modifies a decision with lasting structural impact, especially if it affects multiple components, defines a convention others must follow, changes system boundaries, alters persistence or public contracts, or is likely to be revisited without written context.
   - ADRs that involve multiple modules must include Mermaid diagrams that illustrate the interaction or control flow between the affected modules. Keep the diagrams close to the relevant decision so future readers can understand the contract without reconstructing it from code.
   - Use a lightweight technical decision note in `docs/technical-decisions` when the rationale is important but the decision is still local, tactical, or easily reversible.
   - Do not create an ADR or technical decision note for routine implementation details that are fully understandable from the code and pull request context.
3. **Required closing question for Superpowers artifacts:** If a task produced documents in `docs/superpowers/specs` or `docs/superpowers/plans`, the agent MUST ask the user, verbatim: `Do you want me to keep or delete the Superpowers spec/plan documents created for this task?` The task MUST NOT be considered complete until the user answers. If the need for an ADR or technical decision note is unclear, the agent MUST ask that in the same message before performing cleanup.
4. **Cleanup:** Remove temporary planning artifacts or task-specific scratch files created during execution only after the user has confirmed whether `docs/superpowers/specs` and `docs/superpowers/plans` documents should be kept or deleted. If the user asks to keep them, leave them in place.
5. **Final review:** Verify the changes are consistent with repository standards and that linting and applicable tests pass.

## 4. Agent Response Expectations

- Be explicit about any command that could not be run and why.
- Do not claim success without verification.
- If repository instructions conflict, prefer the most specific instruction applicable to the task.
- If a rule is ambiguous, choose the safer minimal-change path and state your assumption.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **rever-media-sdk** (240 symbols, 466 relationships, 20 execution flows). Use the GitNexus MCP tools to understand code, assess impact, and navigate safely.

> If any GitNexus tool warns the index is stale, run `npx gitnexus analyze` in terminal first.

## Always Do

- **MUST run impact analysis before editing any symbol.** Before modifying a function, class, or method, run `gitnexus_impact({target: "symbolName", direction: "upstream"})` and report the blast radius (direct callers, affected processes, risk level) to the user.
- **MUST run `gitnexus_detect_changes()` before committing** to verify your changes only affect expected symbols and execution flows.
- **MUST warn the user** if impact analysis returns HIGH or CRITICAL risk before proceeding with edits.
- When exploring unfamiliar code, use `gitnexus_query({query: "concept"})` to find execution flows instead of grepping. It returns process-grouped results ranked by relevance.
- When you need full context on a specific symbol — callers, callees, which execution flows it participates in — use `gitnexus_context({name: "symbolName"})`.

## Never Do

- NEVER edit a function, class, or method without first running `gitnexus_impact` on it.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis.
- NEVER rename symbols with find-and-replace — use `gitnexus_rename` which understands the call graph.
- NEVER commit changes without running `gitnexus_detect_changes()` to check affected scope.

## Resources

| Resource | Use for |
|----------|---------|
| `gitnexus://repo/rever-media-sdk/context` | Codebase overview, check index freshness |
| `gitnexus://repo/rever-media-sdk/clusters` | All functional areas |
| `gitnexus://repo/rever-media-sdk/processes` | All execution flows |
| `gitnexus://repo/rever-media-sdk/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
|------|---------------------|
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->
