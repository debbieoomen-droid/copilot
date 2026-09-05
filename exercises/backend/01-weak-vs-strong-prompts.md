# 🧪 Exercise 1 — From Weak to Strong Prompts (Java)

> **Your track today:** Exercise 1 of 3 · next up is `exercises/backend/02`

## 🎯 Learning Objective
After this exercise, you will:
- Understand the difference between weak and strong prompts
- Learn how to guide GitHub Copilot / AI as a pair programmer
- Improve output quality by structuring prompts

---

## ⏱ Duration
10–15 minutes

---

## 🧩 Scenario (Rabobank-style)
You are building a validation step for an internal onboarding tool.

Your task:
👉 **Validate a Dutch BSN** (burgerservicenummer) before a customer record is accepted

A BSN is the Dutch citizen service number — nine digits, and banks validate it during KYC checks.
It is **personal data**, so getting this wrong has consequences beyond a failing test.

---

## 🔹 Step 1 — Weak Prompt

Open GitHub Copilot Chat (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd>) and make sure the
**agents dropdown says Ask**. Then enter this exactly as written — do not improve it:

```
Create a function to validate a BSN
```

> ℹ️ **Ask mode cannot change your files.** It only writes text into the chat panel, so nothing you
> do in this exercise can touch the project. That is why Ask is the safe default and where everyone
> starts. **Agent** mode is the one that edits code — later today.

### 👉 Observe the output
Take 2–3 minutes to review the result and answer:

- Is the solution complete?
- Does it handle invalid input (null, empty, letters, wrong length)?
- **Does it actually check the number is valid — or only that it has nine digits?**
- Would you use this in a real onboarding flow?

---

## 🔹 Step 2 — Strong Prompt

Now guide the AI more like a senior developer would.

Use the prompt below:

```
Act as a senior backend developer.

Create a Java utility class named BsnValidator.
Implement a public static method that validates a Dutch BSN using the official
"elfproef" (11-test).

Requirements:
- Return false when the input is null or blank
- Remove all spaces
- Accept exactly 9 digits, and keep any leading zero
- Reject a BSN consisting only of zeros
- Multiply digits 1 to 8 by the weights 9, 8, 7, 6, 5, 4, 3, 2
- Multiply the 9th digit by -1
- The BSN is valid when the sum of those products is divisible by 11
- Add clear comments explaining each step
- Include a main method with 3 test cases:
  two valid BSNs and one that has nine digits but fails the elfproef

Context:
This will be used in a banking application (Rabobank-like) during customer
onboarding, so reliability is important.

Output:
Clean, production-ready Java.
```

> **Why the `main` method matters:** it is what lets you run the file in Step 4 without a project,
> without Maven and without a compile step. If you change the prompt, keep that line.

---

## 🔍 Step 3 — Compare Results

Compare both outputs and discuss:

| Criteria | Weak Prompt | Strong Prompt |
|---|---|---|
| Completeness | ❌ / ✅ | ✅ |
| **Real elfproef checksum** | ❌ usually just a 9-digit check | ✅ |
| Error handling (null, blank, letters) | ❌ | ✅ |
| Readability | ⚠️ | ✅ |
| Production-ready | ❌ | ✅ |

### 💬 Discussion questions
- What improved the most?
- Which part of the prompt made the biggest difference?
- What would you still improve?

---

## 🧠 Key Insight

AI works best when you:
- Define a role
- Provide clear requirements
- Add context
- Specify the expected output

👉 You are not prompting a tool
👉 You are guiding a developer

---

## ▶️ Step 4 — Actually run it

Comparing two answers on screen is useful. Watching one of them pass its own tests is better.

The strong prompt asked for a `main` method with three test cases — so you can run the file
directly, with no project, no Maven and no compile step:

1. Create a file called **`BsnValidator.java`** anywhere convenient (a scratch folder is fine)
2. Paste in the class Copilot generated from the **strong** prompt
3. In a terminal, from that folder, run:

```bash
java BsnValidator.java
```

> **Why this works without a project:** since Java 11 you can run a single source file directly.
> Java compiles it in memory and runs `main` — handy for exactly this kind of throwaway check.

> **If the ✓/✗ characters show up as `?`**, that's just your terminal's character encoding, not a
> bug in the code. The `true`/`false` values are what matter.

### 🧪 Now test the weak one with the same numbers

This is the moment the exercise is built around. Take these three and try them **against both** of
your implementations:

| BSN | Nine digits? | Actually valid? |
|---|---|---|
| `111222333` | yes | ✅ valid |
| `123456782` | yes | ✅ valid |
| **`123456789`** | **yes** | **❌ invalid — fails the elfproef** |

The weak version almost certainly accepts `123456789`, because it only ever checked that the input
*looks* like a BSN. The strong version rejects it.

> That third number is the whole lesson. It is not malformed. It is not obviously wrong. It would
> sail through a code review. And it is not a real BSN.

### 👉 Now the real question

Copilot wrote both the code **and** the tests that check it. So:

- If the tests pass, what exactly has that proven?
- What would it take to actually trust this in an onboarding flow?
- Try feeding it a valid BSN it has never seen — does it still hold up?

💬 **Discuss:** an AI that writes its own exam and then marks it is not the same as a verified
implementation. This is the habit to take home: generated tests tell you the code does what the
model *thought* you wanted.

---

## 🔍 Optional — compare with something real

The course project contains a validator for the same *kind* of problem: `IbanValidator`, at
`project/backend/src/main/java/nl/rabobank/casesummary/validation/IbanValidator.java`. Different
checksum, same job — reject input that looks right but isn't.

Read it next to what Copilot gave you:

- How does a considered implementation differ from a generated one?
- Notice it is **never called directly**. Find `@ValidIban` in `dto/CreateCaseRequest.java` and
  follow it: the same maths, turned into an annotation that Spring runs on **every** request,
  automatically. That is the distance between a working function and shipped code.

---

## ⚡ Bonus Challenge (optional)

Enhance your prompt even further.

Try adding:
- A typed result object with a reason instead of just true/false
- Logging for invalid cases — but **not** logging the BSN itself, because it is personal data
- Unit test structure (e.g., JUnit 5)

---

## 💬 Takeaway

> "Better prompts don't just ask — they define role, context, and expectations."
