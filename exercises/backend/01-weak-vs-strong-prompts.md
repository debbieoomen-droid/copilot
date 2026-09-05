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
You are building a simple feature for an internal banking tool.

Your task:
👉 Validate an IBAN number before processing a payment  

This functionality must be reliable and production-ready.

---

## 🔹 Step 1 — Weak Prompt

Open GitHub Copilot Chat (**Ask** mode) and enter it exactly as written — do not improve it:

```
Create a function to validate IBAN
```

### 👉 Observe the output
Take 2–3 minutes to review the result and answer:

- Is the solution complete?
- Does it handle invalid input (null, empty, incorrect format)?
- Is the code easy to understand?
- Would you use this in a real banking application?

---

## 🔹 Step 2 — Strong Prompt

Now guide the AI more like a senior developer would.

Use the prompt below — this is the same one on the slide:

```
Act as a senior backend developer.

Create a Java utility class named IbanValidator.
Implement a public static method that validates IBAN numbers using the
official MOD-97 algorithm.

Requirements:
- Return false when the input is null or blank
- Remove all spaces, convert to uppercase
- Check it starts with 2 letters + 2 digits, length 15-34
- Move the first 4 characters to the end
- Convert letters to numbers: A=10 ... Z=35
- Perform the MOD-97 check without BigInteger
- Return true when the remainder is 1
- Add clear comments explaining each step
- Include a main method with 3 test cases:
  one valid Dutch IBAN, one valid German IBAN, one invalid

Context:
This will be used in a banking application (Rabobank-like), so reliability
is important.

Output:
Clean, production-ready Java.
```

> **Why the `main` method matters:** it is what lets you run the file in Step 4
> without a project, without Maven and without a compile step. If you change the
> prompt, keep that line.

---

## 🔍 Step 3 — Compare Results

Compare both outputs and discuss:

| Criteria            | Weak Prompt | Strong Prompt |
|--------------------|------------|--------------|
| Completeness       | ❌ / ✅     | ✅            |
| Error handling     | ❌         | ✅            |
| Readability        | ⚠️         | ✅            |
| Production-ready   | ❌         | ✅            |

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

1. Create a new file called **`IbanValidator.java`** somewhere **outside the course project** —
   your Desktop, or any scratch folder
2. Paste in the class Copilot generated from the **strong** prompt
3. In a terminal, from that folder, run:

```bash
java IbanValidator.java
```

You should see each test case print with a pass/fail marker — the valid Dutch and German IBANs
returning `true`, the invalid one returning `false`.

> **Why this works without a project:** since Java 11 you can run a single source file directly.
> Java compiles it in memory and runs `main` — handy for exactly this kind of throwaway check.

> ⚠️ **Do not save it inside `project/backend/`.** That project already has its own
> `nl.rabobank.casesummary.validation.IbanValidator`, and dropping a second class with the same
> name into `src/` gives you a duplicate-class build error in Exercise 2. This exercise is
> deliberately standalone — you are testing a prompt, not adding a feature.

> **If the ✓/✗ characters show up as `?`**, that's just your terminal's character encoding, not a
> bug in the code. The `true`/`false` values are what matter.

### 👉 Now the real question

Copilot wrote both the code **and** the tests that check it. So:

- If the tests pass, what exactly has that proven?
- What would it take to actually trust this in a payment flow?
- Try feeding it a valid IBAN it has never seen — does it still hold up?

💬 **Discuss:** an AI that writes its own exam and then marks it is not the same as a verified
implementation. This is the habit to take home: generated tests tell you the code does what the
model *thought* you wanted.

---

## ⚡ Bonus Challenge (optional)

Enhance your prompt even further.

Try adding:
- Country-specific IBAN validation rules  
- Error messages instead of just true/false  
- Logging for invalid cases  
- Unit test structure (e.g., JUnit 5)  

---

## 💬 Takeaway

> “Better prompts don’t just ask — they define role, context, and expectations.”