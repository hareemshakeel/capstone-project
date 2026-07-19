# WORKFLOW.md

## Setup
Round 1 (branch `feature/profile-settings-v1-vague`): single vague prompt — 
"Build a profile settings page for the user to edit their email, phone number, 
password, date of birth, and address" — fresh Cursor session, no follow-up 
corrections, accepted as-is.

Round 2 (branch `feature/profile-settings-v2-spec`): detailed prompt with the 
design screenshot attached, explicit scope limit, field-by-field validation 
rules, accessibility requirements, and a required test-writing/verification step.

## Correctness
Round 1 invented its own validation approach with hand-rolled date parsing 
(formatDateForInput, manual Number.isNaN checks) and no schema — no phone 
format check, no digit/length rules. Round 2 used zod with an explicit schema: 
phone numbers require 10–15 digits and numeric-only input; password validates 
only when non-empty, minimum 8 characters. Round 1's validation behavior was 
never actually verified — no tests existed to prove it worked.

## Accessibility
Round 1 was inconsistent: the address.city field had a proper 
`<label htmlFor="address.city">`, but the neighboring address.street field 
(line 258) had no label at all, only a placeholder — a real accessibility gap 
a screen reader user would hit. Round 2, given an explicit "every field needs 
a visible label" constraint, applied `<label htmlFor>` consistently across 
every single field with no exceptions, plus inline error text tied to each 
field via conditional rendering.

## Edge cases
Round 1 never had its edge cases checked — no tests, so empty fields, invalid 
formats, or a future date of birth may or may not be handled correctly; it's 
unverified. Round 2's five tests explicitly covered: successful save, empty 
required fields, invalid email format, invalid (future) date of birth, and 
keyboard-only access to the password visibility toggle — all five passed 
(5.73s test run).

## AI mistake caught
Round 1's ProfileSettings.jsx applied `<label>` to address.city but not to the 
neighboring address.street input, despite both being generated in the same 
component by the same prompt — an inconsistency that would have shipped 
unnoticed without manually reading the diff.

## Scope
The vague prompt in round 1 produced far more than requested: it scaffolded 
an entire backend (auth controllers, User model, auth middleware, routes) and 
an unrequested Register page, none of which were asked for. Round 2's prompt 
explicitly scoped the task to "only build this one page/component," and it 
complied — no backend, no extra pages.

## Review effort / time
Round 1: ~1 sentence prompt, but the AI's own scope expansion meant reviewing 
an entire invented backend + auth system to figure out what actually mattered — 
significant unplanned review surface, and the actual settings form itself was 
never checked for correctness (no tests, missed label bug found only by 
manual diffing).

Round 2: prompt-writing took longer upfront, but the AI ran its own 
verification loop (wrote 5 tests, ran them, fixed until passing) before I 
even reviewed it — review time was mostly confirming test coverage matched 
intent rather than hunting for bugs myself. Round 2 was slower to start but 
faster overall, once round 1's hidden backend/scope review time is counted.