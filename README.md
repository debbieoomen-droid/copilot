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
   | Backend group only: Maven | `mvn -version` | prints a version — *optional, see below* |
   | Frontend group only: Live Server | VS Code extensions | "Live Server" installed |
   | Frontend group, optional: Node.js | `node -v` | v18+ — only needed for the optional `npm test` bonus |

   ⚠️ Your Copilot license is deactivated every 3 months — re-activate it **before** the session, not during.

   > **Backend — you don't actually need Maven installed.** The project ships the Maven Wrapper, so
   > you can use `mvnw` instead of `mvn` everywhere and it fetches Maven for you on first run:
   > `.\mvnw.cmd spring-boot:run` on Windows, `./mvnw spring-boot:run` on macOS/Linux.
   > **Java 17 you do need** — that one cannot be bundled.
   >
   > **Frontend — running the optional unit tests.** The app itself needs nothing but Live Server.
   > If you want the `vitest` bonus challenges, run `npm install` once inside `project/frontend/`
   > first — dependencies are not included in the download.

---

> ⚠️ **All data in this repository is fictional.** Customer names, IBANs, case descriptions and
> amounts are invented sample data created for training purposes only. No real Rabobank customer
> data, systems, credentials or internal infrastructure appear anywhere in this repository.
> The **frontend** app contains **deliberately planted flaws** (two XSS vulnerabilities in
> `admin.js`, one in `case-card.js`, and three bugs in the priority-scoring function) — these are
> intentional exercise material, clearly marked in the code, and must never be copied into real
> systems. The **backend** app is deliberately clean; the insecure `PaymentService` used in
> backend Exercise 3 is supplied inside that exercise, not shipped in the project.

---

## 🗂 Which exercises are for me?

### ⚙️ Backend group → [`exercises/backend/`](exercises/backend/)

| # | Exercise | Project folder |
|---|---|---|
| 1 | [Weak vs strong prompts (Java IBAN validator)](exercises/backend/01-weak-vs-strong-prompts.md) | — |
| 2 | [Copilot for backend development (3 modules)](exercises/backend/02-backend-copilot-modules.md) | `project/backend/` |
| 3 | [Build a custom reviewer agent](exercises/backend/03-build-a-reviewer-agent.md) | `project/backend/` |
| ⚡ | [Optional: metaprompt analysis](exercises/backend/99-optional-metaprompt.md) | — |

> 📂 **Open `project/backend/` as your VS Code folder** (File → Open Folder), not the repository
> root. Copilot only reads `.github/copilot-instructions.md` from the folder you open, and the
> Rabobank backend coding standards live in `project/backend/.github/`.

Start the backend: `cd project/backend` → `mvn spring-boot:run` → http://localhost:8080/api/v1/cases

### 🖥️ Frontend group → [`exercises/frontend/`](exercises/frontend/)

| # | Exercise | Project folder |
|---|---|---|
| 1 | [Weak vs strong prompts (TypeScript IBAN validator)](exercises/frontend/01-weak-vs-strong-prompts.md) | — |
| 2 | [Prompting in the app (RCOF framework)](exercises/frontend/02-prompting-in-the-app.md) | `project/frontend/` |
| 3 | [Build a custom reviewer agent](exercises/frontend/03-build-a-reviewer-agent.md) | `project/frontend/` |

> 📂 **Open `project/frontend/` as your VS Code folder** (File → Open Folder), not the repository
> root. Copilot only reads `.github/copilot-instructions.md` from the folder you open, and the
> Rabobank frontend coding standards live in `project/frontend/.github/`.

Start the frontend: right-click `project/frontend/index.html` → *Open with Live Server* → http://localhost:5500

### 🎁 Both groups (optional)
- [Create a prompt-refiner skill with `/create-skill`](exercises/optional-create-a-skill.md)

### 🧪 All labs on one page → [`labs.html`](labs.html)

Jump straight to your track: [`labs.html#backend`](labs.html#backend) · [`labs.html#frontend`](labs.html#frontend)

### 🛠️ Taking it back to your own work → [`reference/tips-and-tricks.md`](reference/tips-and-tricks.md)

Every prompt template, trick and habit from the session, written out. You don't need the slides — it's all in there.

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
| `reference/` | **[Do it yourself — tips, tricks & prompt templates](reference/tips-and-tricks.md)** ← everything from the session in one file · [slash-command cheatsheet](reference/copilot-cheatsheet.md) · [useful websites](reference/handy-websites.md) · [customization guide](reference/copilot-customization-guide.html) |
| `evaluation.html` | Evaluation form — filled in at the end of the session |

---

## 💡 Two practical notes

- Where any material mentions `@workspace`: newer VS Code versions call this `#codebase` — same feature.
- Choose the best model available in your Copilot model dropdown (e.g. a **GPT-5** model, or leave it on **Auto**).

---

## 🙏 Credits

Original course material by **Remsey Mailjard** — [github.com/RemseyMailjard/GitHub-Copilot-for-Developers](https://github.com/RemseyMailjard/GitHub-Copilot-for-Developers). This fork restructures the exercises per track and applies small fixes for the Rabobank sessions.
