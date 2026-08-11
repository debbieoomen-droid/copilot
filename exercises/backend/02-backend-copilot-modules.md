# 🧪 Exercises — Back-end Development with GitHub Copilot

> All exercises use the **Rabobank Case Summary** back-end (Java 17, Spring Boot 3, H2).  
> Open the project folder `project/backend/` in VS Code before you start.

---

# Module 1 — Applying GenAI to Back-end Development & Code Quality (≈ 1 hour)

## 🎯 Learning Objectives

After this module you will:
- Use Copilot to generate service logic, repository queries, and REST endpoints
- Enforce Rabobank coding standards through structured prompts
- Steer AI output with documentation, comments, and open-file context
- Safely refactor and extend an existing Spring Boot codebase

---

## Exercise 1.1 — Generate a New Service Method

### 🏦 Scenario
The operations team wants to see **all cases assigned to a specific agent** that were created **in the last 7 days**.  
This will power a "My Recent Cases" dashboard widget.

### 📂 Context setup — open these tabs
- `service/CaseService.java`
- `repository/CaseRepository.java`
- `model/CustomerCase.java`
- `dto/CaseSummaryDTO.java`

### Step 1 — Weak Prompt

```
Create a method to get cases by agent
```

Review the output (2 min):
- Does it use the existing `CaseRepository` and `CaseSummaryDTO`?
- Does it filter by the last 7 days?
- Does it follow the same coding style as `getCaseById()`?

### Step 2 — Strong Prompt

```
Act as a senior Java developer working on a Rabobank Spring Boot 3 application.

Add a method getRecentCasesByAgent(String agentName) to CaseService.

Requirements:
- Use a new CaseRepository query: findByAssignedAgentAndCreatedAtAfter(String agent, LocalDateTime since)
- Return List<CaseSummaryDTO>
- Only include cases from the last 7 days
- Reuse the existing private toDTO() mapper
- Add SLF4J logging at INFO level
- Follow the same code style as the existing getCaseById() method

Context:
This will be called from a REST endpoint. The codebase uses constructor injection, no Lombok.
```

### 💬 Discussion
- Which output matched the existing code patterns?
- Did the weak prompt pick up on the 7-day filter requirement?
- How much did listing the existing method names help?

---

## Exercise 1.2 — Add a REST Endpoint with Validation

### 🏦 Scenario
A new business requirement: agents must be able to **assign themselves** to an open case via `PATCH /api/v1/cases/{caseId}/assign`.  
The request body carries only the `agentName`. Business rule: a case can only be assigned when its status is `OPEN`.

### 📂 Context setup — open these tabs
- `controller/CaseController.java`
- `service/CaseService.java`
- `controller/GlobalExceptionHandler.java`
- `model/CaseStatus.java`

### Step 1 — Weak Prompt

```
Add an assign endpoint
```

### Step 2 — Strong Prompt

```
Act as a senior Java developer at Rabobank.

Add a PATCH endpoint to CaseController:  PATCH /api/v1/cases/{caseId}/assign

Requirements:
- Request body: a record AssignRequest(@NotBlank String agentName)
- Delegate to a new CaseService.assignAgent(String caseId, String agentName) method
- Business rule: only cases with status OPEN may be assigned — throw IllegalStateException otherwise
- Set assignedAgent and change status to IN_PROGRESS
- Update the updatedAt timestamp
- Return the updated CaseSummaryDTO with HTTP 200
- Use @Valid on the request body
- Add SLF4J logging: "Case {caseId} assigned to {agentName}"

Follow the exact patterns already used in updateStatus().
```

### 👉 Verify
- Does the generated `AssignRequest` record sit inside `CaseController` like `StatusUpdateRequest`?
- Is the `IllegalStateException` already handled by `GlobalExceptionHandler`?
- Is `@Valid` present on the request body parameter?

---

## Exercise 1.3 — Refactor a Method with Performance Constraints

### 🏦 Scenario
The `maskIban()` method in `CaseService` is called for **every case in a paginated list**.  
On a page of 100 cases this creates 100 intermediate substring objects. Refactor it to use `StringBuilder` and add null/length guard checks.

### 📂 Context setup — open these tabs
- `service/CaseService.java`
- `validation/IbanValidator.java`

### Prompt

```
Act as a senior Java performance engineer at Rabobank.

Refactor the private maskIban() method in CaseService.java.

Current implementation:
- Uses substring concatenation
- Minimal null/length checks

New requirements:
- Use StringBuilder to avoid intermediate String objects
- Guard: if iban is null or shorter than 8 characters, return "****"
- Output format: "NL91 RABO **** **** 37"  (first 4 chars, space, chars 5–8, masked middle, last 2)
- Add a @VisibleForTesting comment so it can be unit-tested later
- Keep the method private
- Add a Javadoc explaining the format

Performance context: this method is called per-row in paginated results of up to 500 cases.
```

### 💬 Discussion
- Did Copilot preserve the existing return value contract (`String`)?
- Was the `StringBuilder` approach actually used, or did it fall back to `+` concatenation?
- Why is it important to specify the exact output format in the prompt?

---

## Exercise 1.4 — Generate a Repository Query with Specifications

### 🏦 Scenario
The compliance team needs a report: **count the number of fraud cases per status in a date range**.

### 📂 Context setup
- `repository/CaseRepository.java`
- `model/CaseCategory.java`
- `model/CaseStatus.java`

### Prompt

```
Act as a senior Java developer at Rabobank.

Add a JPQL query to CaseRepository for a compliance report.

Method signature:
@Query("...")
List<Object[]> countFraudCasesByStatusInRange(
    @Param("start") LocalDateTime start,
    @Param("end") LocalDateTime end
);

Requirements:
- Filter by category = FRAUD_REPORT
- Group by status
- Return rows like [CaseStatus, Long]
- Use parameterized @Param — never concatenate values into the query string
- Follow the existing query style in this repository

Security context: This runs against production data. SQL injection must be impossible.
```

### 👉 Verify
- Is the query fully parameterized (`:start`, `:end`) with no string concatenation?
- Does it use `GROUP BY c.status`?
- Is `CaseCategory.FRAUD_REPORT` referenced correctly in JPQL?

---

## Exercise 1.5 — Generate Unit Tests for an Existing Service

### 🏦 Scenario
`CaseService.updateStatus()` contains business rules (no reopening closed cases, setting `resolvedAt`).  
Write thorough JUnit 5 tests.

### 📂 Context setup
- `service/CaseService.java`
- `service/CaseNotFoundException.java`
- `model/CaseStatus.java`

### Prompt

```
Act as a senior Java test engineer at Rabobank.

Generate JUnit 5 + Mockito tests for CaseService.updateStatus().

The method's business rules:
1. If the case does not exist → CaseNotFoundException
2. If current status is CLOSED → IllegalStateException ("Gesloten zaken kunnen niet worden gewijzigd")
3. If newStatus is RESOLVED → resolvedAt must be set to now
4. updatedAt is always refreshed
5. The modified entity is saved via caseRepository.save()

Write these test cases:
- updateStatus_caseNotFound_throwsCaseNotFoundException
- updateStatus_closedCase_throwsIllegalStateException
- updateStatus_toResolved_setsResolvedAt
- updateStatus_toInProgress_doesNotSetResolvedAt
- updateStatus_always_updatesTimestamp

Use:
- @ExtendWith(MockitoExtension.class)
- @Mock CaseRepository
- @InjectMocks CaseService
- Arrange-Act-Assert pattern
- Descriptive assertion messages
- No Spring context (pure unit tests)
```

### 💬 Discussion
- Did Copilot mock the `Optional.of()` / `Optional.empty()` return correctly?
- Do the assertion messages describe the business rule being tested?
- Which test would catch a regression if someone removed the "closed cases" guard?

---

# Module 2 — Architecture, System Understanding & Reviews (≈ 1 hour)

## 🎯 Learning Objectives

After this module you will:
- Use Copilot to reason about architectural decisions and trade-offs
- Generate system documentation and component overviews
- Enhance code review workflows
- Accelerate onboarding by explaining complex backend logic

---

## Exercise 2.1 — Explain the Architecture

### 🏦 Scenario
A new team member joins the Case Summary project. They need a quick overview of the back-end architecture.

### 📂 Context setup — open these tabs
- `CaseSummaryApplication.java`
- `controller/CaseController.java`
- `service/CaseService.java`
- `repository/CaseRepository.java`
- `model/CustomerCase.java`
- `config/CorsConfig.java`

### Prompt

```
Act as a senior architect at Rabobank.

Explain the architecture of this Spring Boot application to a new team member.

Cover:
1. Layered architecture: Controller → Service → Repository → JPA Entity
2. How requests flow from HTTP to database (trace a GET /api/v1/cases/{id} call)
3. Where business rules live (service layer, not controller)
4. How validation works (Jakarta Validation annotations + custom @ValidIban)
5. How errors are handled centrally (GlobalExceptionHandler)
6. The CORS configuration and why it exists

Format: Use a numbered list with one paragraph per layer.
Include a simple ASCII diagram of the request flow.
```

### 👉 Evaluate
- Is the explanation accurate given the actual code?
- Would a junior developer understand it?
- Did Copilot correctly identify that business rules are in `CaseService`, not `CaseController`?

---

## Exercise 2.2 — Document an Architectural Decision (ADR)

### 🏦 Scenario
The team decided to use **H2 in-memory database** for local development and labs.  
Document this as an Architecture Decision Record (ADR).

### Prompt

```
Act as a senior architect at Rabobank.

Write an Architecture Decision Record (ADR) for this project.

Decision: Use H2 in-memory database for local development and lab exercises.

Follow this ADR template:
- Title
- Status (Accepted)
- Context: Why was a database needed? What are the constraints for a lab/training project?
- Decision: H2 in-memory with Spring Data JPA
- Consequences: What are the trade-offs? (data loss on restart, no production parity, fast startup)
- Alternatives Considered: PostgreSQL testcontainers, SQLite, mock repositories

Context from the codebase:
- The project uses Spring Boot 3.2 with spring-boot-starter-data-jpa
- DataLoader.java seeds 6 sample cases on startup
- application.properties configures H2 console access
- This is a training project, not production code

Format: Markdown with clear sections.
```

### 💬 Discussion
- Are the trade-offs realistic?
- Did Copilot identify the right alternatives for a Rabobank environment?
- Would you add any additional consequences?

---

## Exercise 2.3 — Architecture Trade-off Analysis

### 🏦 Scenario
The product owner asks: *"Should we add a caching layer for the GET /api/v1/cases endpoint?"*

### 📂 Context setup
- `controller/CaseController.java`
- `service/CaseService.java`
- `repository/CaseRepository.java`

### Prompt

```
Act as a senior architect at Rabobank evaluating a caching proposal.

Context:
- The GET /api/v1/cases endpoint returns paginated customer cases
- Cases are updated frequently (status changes, new summaries, agent assignments)
- The back-end uses Spring Boot 3 + Spring Data JPA + H2
- The front-end polls this endpoint every 30 seconds
- Current load: ~50 concurrent internal users (customer service agents)

Analyze whether adding a caching layer (e.g., Spring @Cacheable with Caffeine) makes sense.

Structure your answer as:
1. Current bottleneck analysis — is caching needed at this scale?
2. Arguments FOR caching (with specific Spring annotations)
3. Arguments AGAINST caching (stale data risk for case status updates)
4. Cache invalidation strategy if we proceed
5. Recommendation with reasoning

Keep the analysis specific to this banking case management context.
```

### 👉 Evaluate
- Does the analysis correctly weigh stale data risks for a case management tool?
- Is the recommendation appropriate for 50 concurrent users?
- Did Copilot suggest specific invalidation strategies (e.g., `@CacheEvict` on `updateStatus()`)?

---

## Exercise 2.4 — Code Review with Copilot

### 🏦 Scenario
A colleague submits a pull request that adds a **bulk delete** feature. Review the following code for correctness, security, and Rabobank standards.

### Prompt

```
Act as a senior Java code reviewer at Rabobank.

Review this proposed code addition to CaseController.java:

@DeleteMapping("/bulk")
public ResponseEntity<Void> bulkDelete(@RequestBody List<String> caseIds) {
    for (String id : caseIds) {
        caseRepository.deleteById(id);
    }
    return ResponseEntity.noContent().build();
}

Review criteria:
1. Security: Is there authorization? Could someone delete any case?
2. Architecture: Should the controller call the repository directly?
3. Validation: What if caseIds is null or empty? What if it has 10,000 items?
4. Data integrity: What about related CaseSummary records (foreign key)?
5. Audit trail: Should deletions be logged for compliance?
6. Business rules: Should CLOSED or RESOLVED cases be protected from deletion?
7. Performance: Is deleting one-by-one inside a loop acceptable?
8. Error handling: What if one ID doesn't exist? Should it fail or skip?

For each issue found, provide:
- Severity: 🔴 Critical / 🟡 Warning / 🔵 Suggestion
- The problem
- A code fix or recommendation
```

### 💬 Discussion
- How many issues did Copilot flag?
- Did it catch the missing authorization check?
- Did it suggest using `@Transactional` or batch deletes?
- Would you approve this PR based on the review?

---

## Exercise 2.5 — Generate Onboarding Documentation

### 🏦 Scenario
Create a "Getting Started" guide for new developers joining the Case Summary project, specifically for the back-end.

### 📂 Context setup — open all backend files

### Prompt

```
Act as a senior developer at Rabobank writing onboarding documentation.

Generate a "Back-end Getting Started" guide for new developers joining the Case Summary project.

Based on the open files, include:
1. Prerequisites (Java 17, Maven, IDE setup)
2. How to run the application (mvn spring-boot:run)
3. How to access the H2 console
4. Available REST endpoints with example curl commands
5. Project package structure explained (controller, service, repository, model, dto, config, validation)
6. Key patterns used: constructor injection, records for DTOs, @Valid, custom validators
7. How test data is loaded (DataLoader.java)
8. Common development tasks:
   - Adding a new endpoint
   - Adding a new field to CustomerCase
   - Writing a service test

Format: Markdown with code blocks for commands.
Tone: Friendly but professional. Assume the reader knows Java but is new to this project.
```

### 👉 Evaluate
- Are the curl commands accurate for the actual endpoints?
- Does the guide match the real package structure?
- Would a new developer be productive after reading this?

---

# Module 3 — Responsible Use, Security & Risk Awareness (≈ 1 hour)

## 🎯 Learning Objectives

After this module you will:
- Understand how Copilot generates suggestions and where its limitations are
- Identify and prevent blind trust in generated code
- Apply secure coding practices in Copilot-assisted development
- Handle sensitive data, credentials, and banking-specific security constraints

---

## Exercise 3.1 — Spot the Security Vulnerabilities

### 🏦 Scenario
Copilot generated the following code for a "search cases by customer name" feature.  
Your job: find every security and quality issue.

### Prompt

```
Act as a security engineer at Rabobank.

Analyze this Copilot-generated code for security vulnerabilities:

@GetMapping("/search")
public ResponseEntity<List<CustomerCase>> searchByName(@RequestParam String name) {
    String query = "SELECT c FROM CustomerCase c WHERE c.customerName LIKE '%" + name + "%'";
    List<CustomerCase> results = entityManager.createQuery(query, CustomerCase.class).getResultList();
    return ResponseEntity.ok(results);
}

Identify:
1. All security vulnerabilities (OWASP Top 10 categories)
2. Architectural violations (for a Rabobank Spring Boot app)
3. Data exposure risks (what fields does CustomerCase contain?)
4. Performance concerns

For each issue:
- Name the vulnerability
- Explain why it's dangerous in a banking context
- Provide the secure alternative code

Then write the corrected version that:
- Uses Spring Data JPA parameterized query (not entityManager)
- Returns CaseSummaryDTO (not the entity — it contains raw IBAN)
- Adds input length validation
- Uses pagination
```

### 💬 Discussion
- Did you spot the SQL/JPQL injection before asking Copilot?
- Would Copilot have generated this vulnerable code if prompted poorly?
- Why is returning the JPA entity (with raw IBAN) a data leak in a banking app?

---

## Exercise 3.2 — Credentials and Secrets in Code

### 🏦 Scenario
A developer accidentally asks Copilot to help configure a database connection and gets back hardcoded credentials.

### Prompt

```
Act as a security-focused Java developer at Rabobank.

A developer has this in their application.properties:

spring.datasource.url=jdbc:postgresql://prod-db.rabobank.nl:5432/cases
spring.datasource.username=case_admin
spring.datasource.password=R@b0bank2024!
spring.jpa.hibernate.ddl-auto=update

Identify every security problem and provide the secure alternative.

Cover:
1. Hardcoded credentials — why this is a critical risk
2. The password in plain text — what happens if this is committed to Git?
3. ddl-auto=update on production — what's the risk?
4. Database URL exposing internal infrastructure

Provide:
- Secure application.properties using environment variables / Spring profiles
- A .gitignore rule for sensitive files
- How to use Azure Key Vault or environment variables for secrets
- A pre-commit check to prevent credentials from being committed

Rabobank context: All credentials must come from a vault or CI/CD pipeline. Never hardcoded.
```

### 👉 Expected learnings
- How easily Copilot can generate insecure configuration
- Why `.env` files and vault references are mandatory at Rabobank
- The importance of `.gitignore` and pre-commit hooks

---

## Exercise 3.3 — Validate Copilot's Test Output

### 🏦 Scenario
You asked Copilot to generate tests for the IBAN validation logic. But does it actually test the right things?

### 📂 Context setup
- `validation/IbanValidator.java`
- `validation/ValidIban.java`
- `validation/ValidIbanValidator.java`

### Step 1 — Generate Tests

```
Generate JUnit 5 tests for IbanValidator.isValidIban().

Test cases to include:
- Valid Dutch IBAN (NL91RABO0315273637)
- Valid German IBAN (DE89370400440532013000)
- null input
- Empty string
- Too short IBAN
- Too long IBAN (35+ characters)
- IBAN with lowercase letters
- IBAN with spaces (NL91 RABO 0315 2736 37)
- IBAN with invalid checksum
- IBAN with special characters
```

### Step 2 — Critically Review

Now evaluate the generated tests:

```
Act as a test engineer at Rabobank.

Review the generated IbanValidator tests for completeness.

Check:
1. Does the test for "IBAN with spaces" account for the normalize() method?
2. Are the assertions correct — does NL91RABO0315273637 actually pass the checksum algorithm?
3. Are there edge cases missing? (e.g., IBAN starting with digits, country code only)
4. Do the tests run independently (no shared state)?
5. Are test names descriptive enough for a CI/CD failure report?

List any test that gives a false sense of security (passes but doesn't test what it claims).
```

### 💬 Discussion
- Did Copilot generate a test with an IBAN that actually has a valid checksum?
- How would you verify that the test IBANs are correct, rather than trusting Copilot?
- What's the risk of shipping tests that pass but don't validate the real algorithm?

---

## Exercise 3.4 — Prevent Data Exposure in API Responses

### 🏦 Scenario
A developer asks Copilot to add a new endpoint that returns customer details.  
The generated code directly returns the JPA entity. Review and fix it.

### 📂 Context setup
- `model/CustomerCase.java`
- `dto/CaseSummaryDTO.java`
- `service/CaseService.java`

### Prompt

```
Act as a senior security engineer at Rabobank.

A Copilot-generated endpoint returns the CustomerCase entity directly:

@GetMapping("/{caseId}/details")
public ResponseEntity<CustomerCase> getCaseDetails(@PathVariable String caseId) {
    return ResponseEntity.ok(caseRepository.findById(caseId).orElseThrow());
}

Analyze the data exposure risk:

1. List every field in CustomerCase that should NOT be exposed in an API response
2. Explain why returning JPA entities is an anti-pattern (lazy loading, circular references, data leak)
3. Show how the existing CaseSummaryDTO already solves this (maskedIban instead of raw iban)
4. What additional fields might need masking or exclusion for GDPR compliance?
5. Rewrite this endpoint using the existing service layer pattern

Banking context: At Rabobank, raw IBANs, BSN (social security) numbers, and internal case notes
must never appear in API responses without masking.
```

### 👉 Key takeaways
- JPA entities should **never** be returned directly from a REST controller
- DTOs exist to control exactly what data leaves the system
- Copilot doesn't understand data classification — the developer must enforce it

---

## Exercise 3.5 — Responsible Prompt Engineering for Sensitive Logic

### 🏦 Scenario
You need to implement a fraud detection rule. How do you prompt Copilot without leaking internal business rules into the model's training data?

### Prompt

```
Act as a senior developer at a large Dutch bank.

I need to implement a fraud detection check for incoming transactions.

IMPORTANT: I will describe the logic in abstract terms. Do not ask me for specific
threshold values or internal rule names — those are confidential.

Requirements:
- Create a FraudCheckService with a method: boolean isSuspicious(Transaction transaction)
- Check these generic conditions:
  1. Transaction amount exceeds a configurable threshold (read from application.properties)
  2. Transaction is cross-border (destination country differs from origin)
  3. Transaction occurs outside normal business hours (configurable)
  4. Multiple transactions to the same destination within a time window

Design principles:
- All thresholds must be externalized in configuration (not hardcoded)
- Log suspicious transactions at WARN level (but never log the full account number)
- Return a result object with the triggered rule names, not just true/false
- Make the rules pluggable (Strategy pattern or similar)

Context: This is a Spring Boot 3 application using Java 17.
```

### 💬 Discussion
- Did the prompt avoid revealing specific Rabobank fraud thresholds?
- Is the generated code flexible enough to change thresholds without redeployment?
- Could Copilot's output accidentally contain patterns from other banks' fraud systems?
- Why is it important to **never hardcode** security thresholds in AI-assisted code?

---

## Exercise 3.6 — AI Limitations Awareness

### 🏦 Scenario
Explore where Copilot struggles and produces incorrect or misleading output.

### Step 1 — Test Copilot's Knowledge Boundaries

Try these prompts one by one and evaluate the outputs:

```
1. "Explain the Rabobank API Gateway rate limiting configuration"
   → Copilot should NOT know this. Does it hallucinate an answer?

2. "What version of Spring Boot does this project use?"
   → With pom.xml open, it should correctly say 3.2.0. Without it open — does it guess?

3. "Write a migration script from H2 to PostgreSQL for the customer_cases table"
   → Does it use the actual column names from CustomerCase.java, or generic ones?
```

### Step 2 — Document the Limitations

```
Act as a technical lead at Rabobank writing a team guideline.

Based on what you know about AI coding assistants like GitHub Copilot, write a short
"Copilot Limitations & Guardrails" document for back-end Java developers.

Cover:
1. What Copilot is good at (boilerplate, patterns, test scaffolding, documentation)
2. What Copilot is bad at (business logic, security rules, architecture decisions)
3. When to always manually review (anything touching auth, payments, PII, fraud)
4. Required validation steps before merging Copilot-generated code
5. Data sensitivity: what should never be typed into a Copilot prompt

Format: A concise one-page document with bullet points. Rabobank-appropriate tone.
```

### 💬 Final Discussion
- Did Copilot hallucinate Rabobank-specific details it couldn't know?
- How does "blind trust" in generated code lead to production incidents?
- What is the developer's responsibility when using AI-generated code?

---

# 📋 Quick Reference — Prompt Template

Use this template for any back-end Copilot prompt:

```
Act as a senior [role] at Rabobank.

[What you need — be specific]

Requirements:
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

Context:
- [Framework/tech stack details]
- [Business context — why this matters]
- [Security/compliance constraints]

Follow the same patterns as [existing method/class].
```

---

> 💡 **Remember:** Copilot is a powerful accelerator — but you are the pilot.  
> Every line of generated code must be understood, reviewed, and owned by you.
