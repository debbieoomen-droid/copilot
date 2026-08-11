---
name: unit-test-expert
description: "Turn code into high-quality unit tests by first interviewing the user’s testing style (naming, AAA, mocking, assertions), then generating deterministic, isolated tests. Use when: writing JUnit/Mockito tests, creating test plans, improving coverage, or standardizing unit testing conventions. Keywords: unit test, unittest, JUnit 5, Mockito, AssertJ, parameterized tests, mocks, stubs, test plan, edge cases."
argument-hint: "Paste code or a file path + your test example; I’ll ask 5 style questions and then write unit tests in your style."
user-invocable: true
---

## Purpose
Create expert-level unit tests that match *your* way of testing.

This skill is optimized for:
- Quickly extracting your conventions from an example test
- Asking targeted questions to lock down style and boundaries
- Producing deterministic, isolated, maintainable unit tests

## When to use
Use this skill when you want the assistant to:
- Write new unit tests for an existing codebase (especially Java/Spring)
- Convert informal requirements into executable unit tests
- Increase unit coverage with edge cases and negative tests
- Standardize test naming, structure, and mocking rules across a repo

## Inputs it expects
Provide as much as you can:
- The unit under test (class/function) or file path(s)
- Your example unit test (paste or path)
- Test stack constraints (JUnit 5, Mockito, AssertJ, Spring Boot Test)
- Mocking boundaries (what must be mocked vs real)
- Any domain rules (e.g., date/amount formatting expectations)

## Workflow
### 1) Discover your testing style (5-question interview)
If an example test is provided, infer as much as possible and ask **exactly five** questions to confirm:
1. **Framework & test type**: pure unit vs slice vs integration (e.g., JUnit+Mockito vs @WebMvcTest).
2. **Naming convention**: method naming pattern and granularity (one behavior per test).
3. **Structure**: AAA vs Given/When/Then, nested classes, parameterized tests.
4. **Mocking philosophy**: what gets mocked, how strict verification is, interaction testing vs state testing.
5. **Assertions**: preferred assertion library and what constitutes “good” assertions.

If no example test is available, ask for it first. If the user refuses, proceed with inferred defaults from the repo and state assumptions.

### 2) Build a test plan (brief)
Produce a compact plan:
- Units to test (public methods / behaviors)
- Dependencies and seams (what to mock)
- High-risk areas and edge cases
- Failure modes (exceptions, validation)

### 3) Write the tests (runnable code)
Implementation requirements:
- Deterministic: no real time/network/DB; freeze time and seed randomness when present
- Isolated: mock system boundaries; keep domain objects real
- Maintainable: minimal boilerplate; prefer parameterized tests for matrices
- Clear intent: descriptive names; AAA structure; meaningful assertions

### 4) Validate and iterate
- Run the narrowest relevant test command first
- Fix only issues caused by the new tests
- If the code is hard to test, propose **minimal** refactors (dependency injection, seam extraction)

## Output format
Always return, in order:
1. **Assumptions** (only if needed)
2. **5 interview questions** (only in step 1)
3. **Test plan** (brief bullets)
4. **Test cases list** (scenario → expectation)
5. **Test code** (complete, runnable)
6. **How to run** (exact command)

## Constraints / Quality bar
- No flaky tests; no reliance on execution order
- Avoid over-mocking; mock only boundaries
- Prefer behavior-based assertions over implementation details
- Include negative tests for invalid inputs and exceptions

## Notes
If this repository is a Spring Boot app, default to:
- JUnit 5 (`org.junit.jupiter`)
- Mockito for mocking (`org.mockito`)
- AssertJ if already present; otherwise JUnit assertions

