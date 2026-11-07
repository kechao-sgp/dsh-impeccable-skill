# NOTICE

`dsh-impeccable-skill` packages and adapts the Impeccable design skill for DeepSeek Harness.

## Upstream

**Impeccable** — https://github.com/pbakaus/impeccable
**License:** Apache License 2.0 (full text in [LICENSE](./LICENSE))
**Upstream skill version packaged:** 4.8.0 (skill content), re-checked against the repository on 2026-11-07.
**Author:** Paul Bakaus and Impeccable contributors.

This is a community port. It is not published, endorsed, or supported by the upstream author.

## Third-party notices carried over from upstream

The `skill/reference/ios.md` and `skill/reference/android.md` platform reference files are distilled from ehmo's `platform-design-skills` (Apple Human Interface Guidelines and Material Design 3 rules), rewritten in Impeccable's voice.

**Original work:** https://github.com/ehmo/platform-design-skills
**Original license:** MIT
**Author:** ehmo

## Changes made in this port

Per Apache-2.0 section 4(b), modified files carry a prominent notice of the change. The `skill/` tree here is the upstream skill with these deliberate modifications:

1. **`skill/SKILL.md` — Setup step 1 rewritten.** The upstream step runs a self-contained engine binary (`<skill-base-dir>/scripts/impeccable context`, downloaded on first run). That binary is not packaged and must not be downloaded; the step now loads `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, the surface brief and native-platform guidance directly, and points at `reference/dsh-runtime.md`.
2. **`skill/SKILL.md` — "Launcher unavailable" replaced** by a "No engine binary (this edition)" paragraph that routes to the runtime mapping instead of a retry.
3. **`skill/SKILL.md` — "Pin / Unpin", "Hooks", "Doctor" replaced** by an "Edition limits" section: no `$<command>` shortcuts, no post-edit detector hook, no automated drift repair; each degrades to a documented manual procedure instead of disappearing.
4. **`skill/SKILL.md` — two passages** that referred to rerunning `impeccable context` now refer to the context files loaded at Setup.
5. **`skill/reference/dsh-runtime.md` — added.** Maps every engine verb named by the skill and its references (`context`, `doctor`, `ignores`, `signals`, `detect`, `detect-csp`, `comp-spec`, `comp-diff`, `component-review`, `build-phase`, `surface-brief`, `concept-seed`, `serve-question`, `embed-prompt`, `critique-storage`, `generate-image`, `font-match`, the `live-*` family, `generate`) onto DSH-native actions, including the degradation path where no equivalent exists.
6. **Sixteen reference files — a one-line notice added at the top**: `audit.md`, `component-review.md`, `critique.md`, `degraded/asset-producer.md`, `doctor.md`, `generate.md`, `hooks.md`, `layout.md`, `live-setup.md`, `live.md`, `new-work.md`, `polish.md`, `region-map.md`, `routing.md`, `typeset.md`, `visualize.md`. They cite the engine binary inline; the notice points at the mapping so a reader mid-playbook does not chase a command that cannot run. No other content in those files was changed.

## Content deliberately not packaged

- `scripts/` — the engine launcher, the downloaded private binary, `live-browser.js`, the detector bundle, `data/font-index.json`, checksums. Not redistributed.
- `agents/` — Claude Code subagent definitions (`.toml`, `openai.yaml`). Harness-specific; the upstream `reference/degraded/*.md` inline equivalents are packaged instead.
- `.claude/`, hook installers, and build metadata.

## Plugin code

`index.js`, `cordis.patch.yml`, `locale/`, `icon.svg` and this packaging are original work for DSH, released under the same Apache-2.0 license.
