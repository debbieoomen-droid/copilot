# GitHub Copilot in VS Code — Cheat Sheet

Everything here is what you actually used today. Verified September 2026 against
[code.visualstudio.com](https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features).

> ⚠️ Copilot changes fast. If something below doesn't match your VS Code, trust your screen — and
> check the link above rather than an older blog post.

---

## The three trigger characters

| Type | What it picks | Examples |
|---|---|---|
| `@` | **Who** you're talking to (built-in participants) | `@github`, `@terminal`, `@vscode` |
| `#` | **What** it should look at (context) | `#codebase`, `#selection`, `#changes`, `#<filename>` |
| `/` | **A ready-made task** | `/explain`, `/tests`, `/fix`, `/doc` |

---

## Context references (`#`) — the ones worth remembering

| Reference | What it does |
|---|---|
| `#codebase` | Search the whole project before answering. **The one to remember.** |
| `#<filename>` | Attach a specific file, e.g. `#CaseService.java` |
| `#selection` | Whatever you have highlighted |
| `#changes` | Your current uncommitted changes — good for self-review before a PR |
| `#problems` | Whatever is in the Problems panel |
| `#fetch` | Pull in a URL |
| `#githubRepo` | Search a GitHub repo you don't have open |

You can also press the **+ (Add Context)** button in the chat box, or drag a file onto the chat panel.

> **Note:** in current VS Code the agent often searches the codebase on its own — you don't always
> have to type `#codebase`. Type it when you want to be certain.

---

## Slash commands (`/`)

| Command | What it does |
|---|---|
| `/explain` | Explain the selected code |
| `/fix` | Propose a fix for the problem in the selection |
| `/tests` | Generate unit tests for the selection |
| `/doc` | Add documentation comments |
| `/new` | Scaffold a new project or file |
| `/plan` | Switch to the Plan agent and start planning a task |
| `/clear` | Start a fresh conversation (drop the history) |
| `/agents` | Open the Configure Custom Agents menu — where your agent files live |
| `/prompts`, `/instructions`, `/skills` | The same, for the other customization types |
| `/init` | **Read this project and draft a `copilot-instructions.md` for it** |
| `/create-agent` | Have Copilot write an agent file for you (needs Agent mode) |
| `/create-prompt` | The same, for a prompt file |
| `/create-instruction` | The same, for an instructions file |

Put the command and your text on **one line**: `/tests cover the null and empty-string cases`.

Your own prompt files and skills also appear here as `/<name>`.

---

## Chat agents (formerly "modes")

Selected from the **agents dropdown** in the chat input box.

| Agent | What it does | Changes your files? |
|---|---|---|
| **Ask** | Answers questions, explains, suggests | No |
| **Plan** | Researches the task and writes a plan first | No |
| **Agent** | Does the work — edits files, runs commands, fixes its own errors | **Yes** |
| *your custom agents* | Whatever you defined | Depends on its `tools:` |

> **Edit mode is gone** — removed from VS Code in June 2026. Use Agent instead. If you still see
> Edit, Agent mode has been switched off by policy on your machine.

**Custom agents are selected from this dropdown, not `@`-mentioned.** Typing `@my-agent` just sends
literal text — `@` is only for the built-in participants above.

---

## Handy shortcuts

| Shortcut | Action |
|---|---|
| <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>I</kbd> | Open Copilot Chat |
| <kbd>Ctrl</kbd>+<kbd>I</kbd> | Inline chat, right where the cursor is |
| <kbd>Tab</kbd> | Accept a ghost-text suggestion |
| <kbd>Esc</kbd> | Reject it |
| <kbd>Alt</kbd>+<kbd>]</kbd> / <kbd>[</kbd> | Cycle through alternative suggestions |

---

## Customizing Copilot for your own repo

| What | Where it goes |
|---|---|
| Team coding standards, applied to every prompt | `.github/copilot-instructions.md` |
| Standards for specific paths only | `.github/instructions/*.instructions.md` |
| A saved prompt you trigger with `/name` | `.github/prompts/*.prompt.md` |
| A reusable reviewer/persona you pick from the dropdown | `.github/agents/*.agent.md` |
| A capability Copilot pulls in by itself when relevant | `.github/skills/<name>/SKILL.md` |

Copilot reads these from **the folder you opened in VS Code**. Open the wrong folder and none of
them load — which is silent, so it's worth checking.

You don't have to write these by hand: `/create-agent`, `/create-prompt` and `/create-instruction`
have Copilot generate the file, and the Command Palette has `Chat: New Custom Agent` and friends.
The gear icon in the Chat view shows all of them in one place, where you also choose **Workspace**
(in the repo, everyone gets it) or **User** (your own profile, in every project you open).

**Highest return for the least effort:** write `.github/copilot-instructions.md` for the repo you
work in every day. Type `/init` and Copilot drafts it from your actual codebase; you only correct
it. Twenty minutes once — closer to five with `/init`.

---

## The habit worth keeping

After any answer that matters, expand the collapsed summary line above it — *"Used N references"*,
*"Searched codebase"*, or the list of tool calls, depending on your version — and check **which
files it actually read**. If it didn't read the file that decides the answer, the answer is a guess
dressed up as a fact.
