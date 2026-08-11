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