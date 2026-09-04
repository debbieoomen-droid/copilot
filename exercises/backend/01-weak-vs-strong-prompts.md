# 🧪 Exercise: From Weak → Strong Prompts

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

Open GitHub Copilot Chat (or any AI coding assistant) and enter:


Create a Java method to validate an IBAN


### 👉 Observe the output
Take 2–3 minutes to review the result and answer:

- Is the solution complete?
- Does it handle invalid input (null, empty, incorrect format)?
- Is the code easy to understand?
- Would you use this in a real banking application?

---

## 🔹 Step 2 — Strong Prompt

Now guide the AI more like a senior developer would.

Use the prompt below:


Act as a senior backend developer.

Create a Java method to validate IBAN numbers.

Requirements:

Use the official IBAN checksum algorithm
Handle invalid input (null, empty, wrong length)
Return true/false
Include clear comments
Add 3 example test cases

Context:
This will be used in a banking application (Rabobank-like), so reliability is important.

Output:

Clean, production-ready code

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

1. Create a new file called **`IbanValidator.java`** anywhere convenient (your Desktop is fine)
2. Paste in the class Copilot generated from the **strong** prompt
3. In a terminal, from that folder, run:

```bash
java IbanValidator.java
```

You should see each test case print with a pass/fail marker — the valid Dutch and German IBANs
returning `true`, the invalid one returning `false`.

> **Why this works without a project:** since Java 11 you can run a single source file directly.
> Java compiles it in memory and runs `main` — handy for exactly this kind of throwaway check.

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