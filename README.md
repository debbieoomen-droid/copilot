# 🏦 GitHub Copilot for Developers — Rabobank Training

Hands-on training material for the **GitHub Copilot for Developers** workshop.
Trainer: **Debbie Oomen** (D-Data). Based on the original course by [Remsey Mailjard](https://github.com/RemseyMailjard/GitHub-Copilot-for-Developers).

---

## 🚀 Start here (5 minutes, before the session)

1. **Download this repository**: green **Code** button → *Download ZIP* → unzip somewhere convenient (or `git clone` it).
2. **Check your setup** — open a terminal and verify:

   | Check | Command | Expected |
   |---|---|---|
   | Copilot license | open VS Code → Copilot icon | icon active, chat opens (`Ctrl+Alt+I`) |
   | Backend group only: Java | `java -version` | version **17 or higher** |
   | Backend group only: Maven | `mvn -version` | prints a version |
   | Frontend group only: Live Server | VS Code extensions | "Live Server" installed |

   ⚠️ Your Copilot license is deactivated every 3 months — re-activate it **before** the session, not during.

---

> ⚠️ **All data in this repository is fictional.** Customer names, IBANs, case descriptions and
> amounts are invented sample data created for training purposes only. No real Rabobank customer
> data, systems, credentials or internal infrastructure appear anywhere in this repository.
> Some code contains **deliberately planted flaws** (an XSS vulnerability, SQL injection, and
> three bugs in a scoring function) — these are intentional exercise material, clearly marked in
> the code, and must never be copied into real systems.

---

## 🗂 Which exercises are for me?

### ⚙️ Backend group → [`exercises/backend/`](exercises/backend/)

| # | Exercise | Project folder |
|---|---|---|
| 1 | [Weak vs strong prompts (Java IBAN validator)](exercises/backend/01-weak-vs-strong-prompts.md) | — |
| 2 | [Copilot for backend development (3 modules)](exercises/backend/02-backend-copilot-modules.md) | `project/backend/` |
| 3 | [Build a custom reviewer agent](exercises/backend/03-build-a-reviewer-agent.md) | `project/` |
| ⚡ | [Optional: metaprompt analysis](exercises/backend/99-optional-metaprompt.md) | — |

Start the backend: `cd project/backend` → `mvn spring-boot:run` → http://localhost:8080/api/v1/cases

### 🖥️ Frontend group → [`exercises/frontend/`](exercises/frontend/)

| # | Exercise | Project folder |
|---|---|---|
| 1 | [Weak vs strong prompts (TypeScript IBAN validator)](exercises/frontend/01-weak-vs-strong-prompts.md) | — |
| 2 | [Prompting in the app (RCOF framework)](exercises/frontend/02-prompting-in-the-app.md) | `project/frontend/` |
| 3 | [Build a custom reviewer agent](exercises/frontend/03-build-a-reviewer-agent.md) | `project/` |

Start the frontend: right-click `project/frontend/index.html` → *Open with Live Server* → http://localhost:5500

### 🎁 Both groups (optional)
- [Create a prompt-refiner skill with `/create-skill`](exercises/optional-create-a-skill.md)

### 🧪 All labs on one page → [`labs.html`](labs.html)

Open it in your browser (download the repo first, then double-click the file). It has a
**Backend / Frontend** switch and lists everything in three parts:

| Part | What's in it |
|---|---|
| **In session** | The three exercises we do together today |
| **Extra** | Already-written labs we don't reach today — for the backend group that's two more full modules (architecture, documentation, reviews, security, credentials, responsible use); for the frontend group it's form validation, performance, and self-review |
| **On your own** | Take-home exercises that use **your own repository**, not the sample app — writing Copilot instructions for a real project, turning your most-repeated review comment into an agent, trying Plan mode on a real ticket |

---

## 📁 What's in this repo

| Folder | Contents |
|---|---|
| `exercises/` | All exercises, split per group (see above) |
| `project/` | The **Rabobank Case Summary** app — your sandbox: vanilla JS frontend + Java 17 / Spring Boot 3 backend, with deliberately planted flaws to fix. Full walkthrough in [`project/README.md`](project/README.md) |
| `project/.github/` | Live examples of Copilot customization: instructions, agents, prompts, skills |
| `reference/` | [Slash-command cheatsheet](reference/copilot-cheatsheet.md) · [useful websites](reference/handy-websites.md) · [customization guide](reference/copilot-customization-guide.html) |
| `evaluation.html` | Evaluation form — filled in at the end of the session |

---

## 💡 Two practical notes

- Where any material mentions `@workspace`: newer VS Code versions call this `#codebase` — same feature.
- Choose the best model available in your Copilot model dropdown (e.g. a **GPT-5** model, or leave it on **Auto**).

---

## 🙏 Credits

Original course material by **Remsey Mailjard** — [github.com/RemseyMailjard/GitHub-Copilot-for-Developers](https://github.com/RemseyMailjard/GitHub-Copilot-for-Developers). This fork restructures the exercises per track and applies small fixes for the Rabobank sessions.
