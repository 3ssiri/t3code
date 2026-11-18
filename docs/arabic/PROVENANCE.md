# Provenance of the Arabic localization

> **بالعربية باختصار:** هذا سجل علني بتاريخ العمل ووقته وما أُنجز، مع ما سبقنا من أعمال ونسبتها لأصحابها. كل أوقات الدفع أدناه من سجل `GitHub` نفسه، لا من أجهزتنا. لم نأخذ نصًا ولا كودًا من أي عمل آخر.

This file records when and how the Arabic localization in this fork was made, so its origin can be checked by anyone. All times are UTC.

## Independent evidence

Push times below come from GitHub's own activity log for `3ssiri/t3code` (`GET /repos/3ssiri/t3code/activity`), not from local clocks. Commit hashes link each push to its exact content.

| UTC time         | Event                                           | Head commit  |
| ---------------- | ----------------------------------------------- | ------------ |
| 2026-11-18 04:37 | Public fork created, branch `arabic`            | `342fdd1549` |
| 2026-11-18 05:10 | Glossary and style guide pushed                 | `d34ca7b2d0` |
| 2026-11-18 05:29 | Locale registration and RTL foundation pushed   | `5450f79ff5` |
| 2026-11-18 11:19 | Glossary with cited dictionary sources pushed   | `a8cc6bc4a4` |
| 2026-11-18 13:42 | Full Arabic catalogs for web and desktop pushed | `f5d7982867` |
| 2026-11-18 15:41 | RTL layout fixes pushed                         | `9a0be04331` |
| 2026-11-18 20:52 | Verification and owner review recorded          | `455991e928` |

## What was made here

- Arabic registered as a UI language for web and desktop, with the document direction following the locale.
- Catalogs translated from this repository's own English source catalogs: 9,641 web and 101 desktop strings, all 406 plural messages in Arabic's six forms.
- A glossary and style guide written for this work, with terms checked against published Arabic dictionaries on the Siwar platform (sources cited in `glossary.md`).
- About 640 physical `left`/`right` classes replaced with logical ones; code, terminal, diffs and paths kept left to right.
- Translation tooling (validator, chunker, context map) in `scripts/arabic/`.

The work was planned and reviewed by the fork owner, and produced with Claude Code. Every commit on `arabic` is the record of who changed what.

## Prior and related work (credited, not used as a source)

| Work                                                                                              | Author               | Date               | Relation                                                                         |
| ------------------------------------------------------------------------------------------------- | -------------------- | ------------------ | -------------------------------------------------------------------------------- |
| [#1767](https://github.com/pingdotgg/t3code/issues/1767) RTL languages in the UI                  | AsimNet              | 2026-04-06         | Feature request, closed in favor of #1771                                        |
| [#1771](https://github.com/pingdotgg/t3code/issues/1771) Logical Tailwind utilities               | AsimNet              | 2026-04-06         | The approach our layout fixes follow                                             |
| RTL fixes for chat content (#22777, #24050, #26095, #36779, #36876, #36922 and others)            | several contributors | 2026-10 to 2026-11 | Merged upstream; message text direction, which we did not change                 |
| [t3code-rtl](https://github.com/farhadeidi/t3code-rtl)                                            | farhadeidi           | 2026-08-11         | Local patch for chat message direction and a Persian font; no UI translation     |
| [Discussion #37962](https://github.com/pingdotgg/t3code/discussions/37962) Arabic with RTL layout | Moo3th               | 2026-11-17 06:58   | Feature proposal describing a private local build; no code or strings are public |

No code, translation, or glossary entry was taken from any of these. The private build described in #37962 has not been published, so it could not have been a source.

## How to verify

```bash
git log --format="%h %aI %s" upstream/main..arabic
gh api "repos/3ssiri/t3code/activity?per_page=100" --jq '.[] | "\(.timestamp) \(.ref) \(.after[0:10])"'
```
