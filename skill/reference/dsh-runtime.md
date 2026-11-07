# DSH runtime mapping

This edition ships no engine binary, no browser bridge, and no editor hooks. Every `scripts/impeccable <verb>` call in this skill and its references maps to a DSH-native action below. Read this once per session before the first engine command, then proceed without asking the user to install anything.

`<project>` is the user's project root. All state the engine used to keep still lives in `<project>/.impeccable/`, as JSON and Markdown you read and write with ordinary file tools.

## Load and inspect

| Engine call | What it did | Do this instead |
|---|---|---|
| `impeccable context` | Loaded PRODUCT.md, DESIGN.md, the surface brief, native guidance, and emitted directives | Read `PRODUCT.md`, `DESIGN.md`, `.impeccable/design.json`, the matching `.impeccable/surfaces/<surface>.md`, and `reference/ios.md` / `reference/android.md` when the recorded platform is native. List what is missing; never invent it. |
| `impeccable doctor` | Reported drift between artifacts and this version | Walk the checklist in [doctor.md](doctor.md) with file reads. Report; do not repair as a side effect of a design task. |
| `impeccable ignores` | Edited ignore lists | Edit `.impeccable/config.local.json` directly. |
| `impeccable signals` | Aggregated detector output | Produce the same findings yourself with the `detect` row below. |

## Detection

| Engine call | What it did | Do this instead |
|---|---|---|
| `impeccable detect`, `detect-csp` | Ran the UI anti-pattern detector over changed files and surfaced findings | Manual pass, in this order: (1) read [craft-floor.md](craft-floor.md) and treat its bans as the rule list; (2) `grep -n` the changed UI files for the bans and for the audit checks in [audit.md](audit.md) — inline handlers replacing real controls, `!important`, `transition: all`, `outline: none` without a replacement focus style, raw hex outside the token file, fixed `px` font sizes, missing `alt`/`label`/`aria-*`, `tabindex` above 0, hover-only affordances; (3) read the hits in context before calling them defects; (4) report `file:line` with the rule name. Say in one line that detection was a manual pass, not a hook. |

## Build and review state

| Engine call | What it did | Do this instead |
|---|---|---|
| `comp-spec --grid`, `--regions`, `--inspect-map`, `--print`, `--schema` | Measured a comp into `.impeccable/build/spec.json`: region boxes, sampled palettes, media | Read the comp with the image reader, draw the grid yourself if it helps you name spans, and write `.impeccable/build/spec.json` by hand in the shape [region-map.md](region-map.md) describes. Sample colors from the image; do not claim pixel measurement you did not do — say the boxes are estimated. |
| `comp-diff` | Numeric diff between comp and render | Capture both with the screenshot path below, read them side by side, and report differences in words with the region ids. |
| `component-review` | Component-region review packet | Write `.impeccable/review/components.json` yourself and follow [component-review.md](component-review.md); the human checkpoint in that file is unchanged. |
| `build-phase` | Advanced `.impeccable/build/state.json` through phases | Edit `state.json` by hand to the phase you actually finished. Never mark a gate passed that you did not check. |
| `surface-brief` | Wrote `.impeccable/surfaces/<surface>.md` | Write that Markdown file yourself from the mode and constraints you established. |
| `concept-seed`, `serve-question`, `embed-prompt` | Prepared prompts and decision pages for the user | Write the same artifact as a plain Markdown file under `.impeccable/` and ask the question in chat with `ask_user_question` when a choice blocks the work. |
| `critique-storage` | Stored critique rounds under `.impeccable/critique/` | Write `round-<n>.md` yourself; never overwrite an earlier round. |

## Assets and visuals

| Engine call | What it did | Do this instead |
|---|---|---|
| `generate-image` | Rendered a mock, plate, or texture | Use the `generate_image` tool with the prompt this skill builds (a plate prompt stays a plate prompt: same subject, same palette, no UI chrome). Save into `.impeccable/mocks/`. Then inspect the result with the image reader before building against it. |
| `font-match --measure`, `--rank` | Measured type in the comp and ranked real faces | No equivalent. Choose the closest obtainable face by eye from the comp, state that the size is estimated, and prefer the project's existing stack when it is already close. |

## Live browser

`live`, `live-server`, `live-poll`, `live-status`, `live-complete`, `live-wrap`, `live-resume`, `live-insert`, `live-generate`, `generate`, `live-setup` all need the engine's browser bridge, which this edition does not have. Degrade like this:

1. Build the alternatives as static variants under `.impeccable/live/variants/<n>/`, each a complete standalone file, each named with the design intent it tests.
2. Capture each variant with the screenshot path below, at the sizes that surface ships at.
3. Report the variant paths with one line on what each tests, then let the user pick. Do not claim the interactive picker exists, and do not fake a picking session.

## Screenshots

There is no engine screenshot command. In order of preference: the `playwright` skill (`playwright-cli`) when the project has a dev server or local HTML; committed visual-regression goldens when the app cannot run; otherwise ask the user for a capture. Keep captures at the sizes the surface ships at, and batch the checks — fix what one look shows before looking again.
